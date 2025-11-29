import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Eye, Loader2, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';
import { StudentService, type Student } from '../services/student.service';

export const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.full_name.toLowerCase().includes(query) ||
          student.username.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await StudentService.getAllStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (student: Student) => {
    const today = new Date();
    const lastActivity = student.last_activity
      ? new Date(student.last_activity)
      : null;

    if (!lastActivity) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          Belum Input
        </span>
      );
    }

    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3" />
          Aktif
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        Tidak Aktif
      </span>
    );
  };

  const activeCount = students.filter((s) => {
    if (!s.last_activity) return false;
    const daysDiff = Math.floor(
      (new Date().getTime() - new Date(s.last_activity).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 7;
  }).length;

  const inactiveCount = students.filter((s) => s.last_activity).length - activeCount;
  const noInputCount = students.filter((s) => !s.last_activity).length;

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Data Mahasiswa</h1>
        <p className="text-slate-600 mt-1">
          Monitor aktivitas dan input rekam medis mahasiswa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Mahasiswa</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {students.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Aktif (7 hari)</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {activeCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tidak Aktif</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {inactiveCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Belum Input</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {noInputCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Daftar Mahasiswa ({filteredStudents.length})
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama atau username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Nama Lengkap
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Username
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-slate-700">
                      Total Input
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Aktivitas Terakhir
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 text-sm font-medium text-slate-900">
                        {student.full_name}
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {student.username}
                      </td>
                      <td className="p-3 text-sm text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                          {student.total_input}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {student.last_activity
                          ? formatDate(student.last_activity)
                          : '-'}
                      </td>
                      <td className="p-3 text-center">
                        {getStatusBadge(student)}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">
                {searchQuery
                  ? 'Mahasiswa tidak ditemukan'
                  : 'Belum ada data mahasiswa'}
              </p>
              <p className="text-sm mt-1">
                {searchQuery
                  ? 'Coba kata kunci pencarian lain'
                  : 'Data mahasiswa akan muncul setelah ditambahkan'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </PageWrapper>
  );
};
