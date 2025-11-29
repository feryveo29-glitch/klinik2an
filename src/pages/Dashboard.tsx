import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MainLayout } from '../components/layout/MainLayout';
import {
  FileText,
  Users,
  BarChart3,
  PlusCircle,
  ClipboardList,
  Activity,
  Loader2
} from 'lucide-react';
import type { User } from '../types/auth.types';
import { DashboardService, type DashboardStats, type MahasiswaRecord, type DosenReviewItem } from '../services/dashboard.service';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({});
  const [mahasiswaRecords, setMahasiswaRecords] = useState<MahasiswaRecord[]>([]);
  const [dosenReviews, setDosenReviews] = useState<DosenReviewItem[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr) as User;
      setUser(parsedUser);
      loadDashboardData(parsedUser);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardData = async (currentUser: User) => {
    setLoading(true);
    try {
      if (currentUser.role === 'mahasiswa') {
        const [statsData, recordsData] = await Promise.all([
          DashboardService.getMahasiswaStats(currentUser.id),
          DashboardService.getMahasiswaRecords(currentUser.id),
        ]);
        setStats(statsData);
        setMahasiswaRecords(recordsData);
      } else if (currentUser.role === 'dosen') {
        const [statsData, reviewsData] = await Promise.all([
          DashboardService.getDosenStats(),
          DashboardService.getDosenReviewList(),
        ]);
        setStats(statsData);
        setDosenReviews(reviewsData);
      } else if (currentUser.role === 'admin') {
        const statsData = await DashboardService.getAdminStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (!user) return null;

    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      );
    }

    switch (user.role) {
      case 'mahasiswa':
        return renderMahasiswaContent();
      case 'dosen':
        return renderDosenContent();
      case 'admin':
        return renderAdminContent();
      default:
        return null;
    }
  };

  const renderMahasiswaContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Selamat Datang, {user?.name}
        </h2>
        <p className="text-slate-600">
          Mulai membuat rekam medis atau lihat riwayat input Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Buat Rekam Medis Baru</h3>
                <p className="text-blue-100 text-sm">
                  Input data pasien dan informasi medis lengkap
                </p>
                <Button
                  onClick={() => navigate('/create-medical-record')}
                  className="mt-4 bg-white text-blue-600 hover:bg-blue-50"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Mulai Input
                </Button>
              </div>
              <FileText className="w-20 h-20 text-blue-200 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Input Saya
                </p>
                <p className="text-4xl font-bold text-slate-900 mt-2">
                  {stats.totalInput || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Rekam medis</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Riwayat Input Saya
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mahasiswaRecords.length > 0 ? (
            <div className="space-y-3">
              {mahasiswaRecords.map((record) => (
                <div
                  key={record.id_kunjungan}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {record.pasien.nama_lengkap} ({record.pasien.no_rm})
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(record.tgl_kunjungan)}
                        {record.diagnosis && (
                          <span className="ml-2 text-blue-600">
                            • {record.kode_icd10}: {record.diagnosis}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Lihat Detail
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>Belum ada rekam medis yang dibuat</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDosenContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Selamat Datang, {user?.name}
        </h2>
        <p className="text-slate-600">
          Pantau dan review input mahasiswa Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Mahasiswa
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.totalMahasiswa || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Input
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.totalInput || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Perlu Review
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.perluReview || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Daftar Input Mahasiswa (Perlu Review)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dosenReviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Nama Mahasiswa
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Tanggal Input
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dosenReviews.map((review) => (
                    <tr key={review.id_kunjungan} className="border-t hover:bg-slate-50">
                      <td className="p-3 text-sm text-slate-900">
                        {review.mahasiswa_name}
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {formatDate(review.tgl_kunjungan)}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {review.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>Tidak ada input yang perlu direview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard Admin
        </h2>
        <p className="text-slate-600">
          Monitor dan kelola sistem rekam medis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/students')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Data Mahasiswa
                </h3>
                <p className="text-sm text-slate-600">
                  Monitor aktivitas dan input mahasiswa
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {stats.totalUsers ? stats.totalUsers - 3 : 0} mahasiswa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/patients')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Data Pasien
                </h3>
                <p className="text-sm text-slate-600">
                  Lihat semua data pasien dan rekam medis
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {stats.totalRekamMedis || 0} kunjungan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Pasien</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalPasien || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Pasien terdaftar</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pasien Hari Ini</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pasienHariIni || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Registrasi hari ini</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-teal-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Pegawai</p>
                <p className="text-3xl font-bold text-teal-600">
                  {stats.totalPegawai || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Dosen & Admin</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistik Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Total User</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalUsers || 0}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Rekam Medis</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalRekamMedis || 0}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Active Today</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.activeToday || 0}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900">{stats.storageUsed || '0 MB'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {renderContent()}
    </MainLayout>
  );
};
