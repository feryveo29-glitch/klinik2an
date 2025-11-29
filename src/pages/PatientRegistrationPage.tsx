import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { UserPlus, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { PatientService } from '../services/patient.service';
import { QueueService } from '../services/queue.service';
import { DummyDataService } from '../services/dummy-data.service';
import type { User } from '../types/auth.types';

export const PatientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [queueNumber, setQueueNumber] = useState('');
  const [queueValidating, setQueueValidating] = useState(false);
  const [queueValid, setQueueValid] = useState<boolean | null>(null);

  console.log('PatientRegistrationPage loaded - Version 3.1 with Dummy Data Generator (Fixed Case)');
  console.log('User:', user);
  console.log('Is Admin:', user?.role?.toLowerCase() === 'admin');

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const [formData, setFormData] = useState({
    nik: '',
    no_rm: '',
    nama_lengkap: '',
    tempat_lahir: '',
    tgl_lahir: '',
    jenis_kelamin: '',
    agama: '',
    golongan_darah: '',
    pekerjaan: '',
    pendidikan: '',
    status_kawin: '',
    alamat: '',
    no_hp: '',
    email: '',
    nama_ayah: '',
    nama_ibu: '',
    nama_wali: '',
    no_hp_wali: '',
    no_bpjs: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    console.log('useEffect - userStr:', userStr);
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr) as User;
      console.log('useEffect - parsedUser:', parsedUser);
      console.log('useEffect - parsedUser.role:', parsedUser.role);
      setUser(parsedUser);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleValidateQueue = async () => {
    if (!queueNumber.trim()) {
      return;
    }

    setQueueValidating(true);
    setQueueValid(null);

    try {
      const queues = await QueueService.getTodayQueues('A');
      const matchingQueue = queues.find(
        (q) =>
          q.full_queue_code.toUpperCase() === queueNumber.trim().toUpperCase() &&
          q.status === 'waiting'
      );

      setQueueValid(!!matchingQueue);
    } catch (error) {
      console.error('Error validating queue:', error);
      setQueueValid(false);
    } finally {
      setQueueValidating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateNoRM = async () => {
    const lastRM = await PatientService.getLastMedicalRecordNumber();
    const newNumber = lastRM ? parseInt(lastRM.replace(/\D/g, '')) + 1 : 1;
    const newRM = `RM${String(newNumber).padStart(6, '0')}`;
    handleInputChange('no_rm', newRM);
  };

  const handleGenerateDummyData = async () => {
    const dummyData = DummyDataService.generatePatientData();
    await generateNoRM();
    setFormData(prev => ({
      ...prev,
      ...dummyData,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nik ||
      !formData.no_rm ||
      !formData.nama_lengkap ||
      !formData.tgl_lahir ||
      !formData.jenis_kelamin
    ) {
      alert('Lengkapi field yang wajib diisi (*)');
      return;
    }

    setLoading(true);
    try {
      await PatientService.createPatient({
        nik: formData.nik,
        no_rm: formData.no_rm,
        nama_lengkap: formData.nama_lengkap,
        tempat_lahir: formData.tempat_lahir || null,
        tgl_lahir: formData.tgl_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        agama: formData.agama || null,
        golongan_darah: formData.golongan_darah || null,
        pekerjaan: formData.pekerjaan || null,
        pendidikan: formData.pendidikan || null,
        status_kawin: formData.status_kawin || null,
        alamat: formData.alamat || null,
        no_hp: formData.no_hp || null,
        email: formData.email || null,
        nama_ayah: formData.nama_ayah || null,
        nama_ibu: formData.nama_ibu || null,
        nama_wali: formData.nama_wali || null,
        no_hp_wali: formData.no_hp_wali || null,
        no_bpjs: formData.no_bpjs || null,
        metadata_user_buat: user?.id,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/patients');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create patient:', error);
      alert(error.message || 'Gagal mendaftarkan pasien. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nik: '',
      no_rm: '',
      nama_lengkap: '',
      tempat_lahir: '',
      tgl_lahir: '',
      jenis_kelamin: '',
      agama: '',
      golongan_darah: '',
      pekerjaan: '',
      pendidikan: '',
      status_kawin: '',
      alamat: '',
      no_hp: '',
      email: '',
      nama_ayah: '',
      nama_ibu: '',
      nama_wali: '',
      no_hp_wali: '',
      no_bpjs: '',
    });
    setQueueNumber('');
    setQueueValid(null);
  };

  if (success) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Pasien Berhasil Didaftarkan!
              </h2>
              <p className="text-slate-600">
                Data pasien telah disimpan. Anda akan diarahkan ke halaman data pasien...
              </p>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pendaftaran Pasien Baru</h1>
          <p className="text-slate-600 mt-1">
            Lengkapi data pribadi pasien untuk membuat rekam medis baru
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Data Identitas Pasien
              </CardTitle>
              {isAdmin && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDummyData}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Dummy Data
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b pb-4 mb-4">
                <Label htmlFor="queue_number" className="text-sm font-semibold">
                  Nomor Antrian dari APM (Opsional)
                </Label>
                <p className="text-xs text-slate-500 mb-2 mt-1">
                  Jika pasien sudah mengambil nomor dari mesin APM Counter A (Pasien Baru), masukkan untuk validasi.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="queue_number"
                    placeholder="A001"
                    value={queueNumber}
                    onChange={(e) => setQueueNumber(e.target.value.toUpperCase())}
                    maxLength={4}
                    className="flex-1 max-w-[200px]"
                  />
                  <Button
                    type="button"
                    onClick={handleValidateQueue}
                    disabled={queueValidating || !queueNumber}
                    variant="outline"
                  >
                    {queueValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validasi...
                      </>
                    ) : (
                      'Validasi'
                    )}
                  </Button>
                </div>

                {queueValid === true && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-green-700">
                      Nomor antrian valid dan sesuai
                    </span>
                  </div>
                )}

                {queueValid === false && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-yellow-700">
                      Nomor tidak cocok atau sudah digunakan. Anda tetap bisa melanjutkan.
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK *</Label>
                  <Input
                    id="nik"
                    type="text"
                    placeholder="Nomor Induk Kependudukan"
                    value={formData.nik}
                    onChange={(e) => handleInputChange('nik', e.target.value)}
                    required
                    maxLength={16}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_rm">No. Rekam Medis *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="no_rm"
                      type="text"
                      placeholder="Nomor Rekam Medis"
                      value={formData.no_rm}
                      onChange={(e) => handleInputChange('no_rm', e.target.value)}
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateNoRM}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                  <Input
                    id="nama_lengkap"
                    type="text"
                    placeholder="Nama Lengkap Pasien"
                    value={formData.nama_lengkap}
                    onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input
                    id="tempat_lahir"
                    type="text"
                    placeholder="Kota/Kabupaten"
                    value={formData.tempat_lahir}
                    onChange={(e) => handleInputChange('tempat_lahir', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tgl_lahir">Tanggal Lahir *</Label>
                  <Input
                    id="tgl_lahir"
                    type="date"
                    value={formData.tgl_lahir}
                    onChange={(e) => handleInputChange('tgl_lahir', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                  <Select
                    value={formData.jenis_kelamin}
                    onValueChange={(value) => handleInputChange('jenis_kelamin', value)}
                  >
                    <SelectTrigger id="jenis_kelamin">
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="golongan_darah">Golongan Darah</Label>
                  <Select
                    value={formData.golongan_darah}
                    onValueChange={(value) => handleInputChange('golongan_darah', value)}
                  >
                    <SelectTrigger id="golongan_darah">
                      <SelectValue placeholder="Pilih Golongan Darah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agama">Agama</Label>
                  <Select
                    value={formData.agama}
                    onValueChange={(value) => handleInputChange('agama', value)}
                  >
                    <SelectTrigger id="agama">
                      <SelectValue placeholder="Pilih Agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Kristen">Kristen</SelectItem>
                      <SelectItem value="Katolik">Katolik</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_kawin">Status Perkawinan</Label>
                  <Select
                    value={formData.status_kawin}
                    onValueChange={(value) => handleInputChange('status_kawin', value)}
                  >
                    <SelectTrigger id="status_kawin">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                      <SelectItem value="Menikah">Menikah</SelectItem>
                      <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pekerjaan">Pekerjaan</Label>
                  <Input
                    id="pekerjaan"
                    type="text"
                    placeholder="Pekerjaan"
                    value={formData.pekerjaan}
                    onChange={(e) => handleInputChange('pekerjaan', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pendidikan">Pendidikan</Label>
                  <Select
                    value={formData.pendidikan}
                    onValueChange={(value) => handleInputChange('pendidikan', value)}
                  >
                    <SelectTrigger id="pendidikan">
                      <SelectValue placeholder="Pilih Pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tidak Sekolah">Tidak Sekolah</SelectItem>
                      <SelectItem value="SD">SD</SelectItem>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="SMA">SMA</SelectItem>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <textarea
                    id="alamat"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alamat lengkap pasien"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_hp">No. HP</Label>
                  <Input
                    id="no_hp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.no_hp}
                    onChange={(e) => handleInputChange('no_hp', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="no_bpjs">No. BPJS Kesehatan</Label>
                  <Input
                    id="no_bpjs"
                    type="text"
                    placeholder="0001234567890 (Kosongkan jika bukan pasien BPJS)"
                    value={formData.no_bpjs}
                    onChange={(e) => handleInputChange('no_bpjs', e.target.value)}
                    maxLength={13}
                  />
                  <p className="text-xs text-slate-500">
                    Isi nomor BPJS jika pasien merupakan peserta BPJS Kesehatan
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Data Keluarga
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama_ayah">Nama Ayah</Label>
                    <Input
                      id="nama_ayah"
                      type="text"
                      placeholder="Nama ayah kandung"
                      value={formData.nama_ayah}
                      onChange={(e) => handleInputChange('nama_ayah', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama_ibu">Nama Ibu</Label>
                    <Input
                      id="nama_ibu"
                      type="text"
                      placeholder="Nama ibu kandung"
                      value={formData.nama_ibu}
                      onChange={(e) => handleInputChange('nama_ibu', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama_wali">Nama Wali (jika ada)</Label>
                    <Input
                      id="nama_wali"
                      type="text"
                      placeholder="Nama wali/penanggung jawab"
                      value={formData.nama_wali}
                      onChange={(e) => handleInputChange('nama_wali', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no_hp_wali">No. HP Wali</Label>
                    <Input
                      id="no_hp_wali"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.no_hp_wali}
                      onChange={(e) => handleInputChange('no_hp_wali', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Daftar Pasien
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};
