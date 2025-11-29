import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Mail,
  FileText,
  Loader2,
  Calendar,
  User,
  CheckCircle2,
} from 'lucide-react';
import { StudentService, type StudentDetail } from '../services/student.service';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStudentDetail(id);
    }
  }, [id]);

  const loadStudentDetail = async (studentId: string) => {
    setLoading(true);
    try {
      const data = await StudentService.getStudentById(studentId);
      setStudent(data);
    } catch (error) {
      console.error('Failed to load student detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Data mahasiswa tidak ditemukan</p>
        <Button onClick={() => navigate('/students')} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/students')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
      </div>

      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{student.full_name}</CardTitle>
              <p className="text-slate-600 mt-1">Mahasiswa</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {student.full_name.charAt(0).toUpperCase()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Username / Email</p>
                  <p className="font-medium text-slate-900">{student.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Terdaftar Sejak</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(student.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Total Input</p>
                  <p className="font-medium text-slate-900">
                    {student.total_input} rekam medis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Aktivitas Terakhir</p>
                  <p className="font-medium text-slate-900">
                    {student.last_activity
                      ? formatDateTime(student.last_activity)
                      : 'Belum ada aktivitas'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Daftar Kasus yang Diinput ({student.kunjungan.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.kunjungan.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Tanggal
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      No. RM
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Nama Pasien
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Jenis Kunjungan
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Unit Pelayanan
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Diagnosis
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.kunjungan.map((kunjungan) => (
                    <tr
                      key={kunjungan.id_kunjungan}
                      className="border-t hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 text-sm text-slate-600">
                        {formatDateTime(kunjungan.tgl_kunjungan)}
                      </td>
                      <td className="p-3 text-sm font-medium text-blue-600">
                        {kunjungan.pasien.no_rm}
                      </td>
                      <td className="p-3 text-sm text-slate-900">
                        {kunjungan.pasien.nama_lengkap}
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {kunjungan.jenis_kunjungan}
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {kunjungan.unit_pelayanan}
                      </td>
                      <td className="p-3 text-sm text-slate-900">
                        {kunjungan.diagnosis ? (
                          <div>
                            <p className="font-medium">
                              {kunjungan.diagnosis.kode_icd10}
                            </p>
                            <p className="text-xs text-slate-500">
                              {kunjungan.diagnosis.nama_diagnosis}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">Belum ada kasus yang diinput</p>
              <p className="text-sm mt-1">
                Mahasiswa ini belum membuat rekam medis
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </PageWrapper>
  );
};
