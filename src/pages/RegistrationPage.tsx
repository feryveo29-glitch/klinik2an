import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  ClipboardList,
  Search,
  Printer,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { PatientService, type Patient } from '../services/patient.service';
import {
  RegistrationService,
  type CreateRegistrationInput,
  type RegistrationWithPatient,
} from '../services/registration.service';
import { QueueService } from '../services/queue.service';
import { useToast } from '../components/ui/toast';
import type { User } from '../types/auth.types';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [todayRegistrations, setTodayRegistrations] = useState<RegistrationWithPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastRegistration, setLastRegistration] = useState<RegistrationWithPatient | null>(null);
  const [queueNumber, setQueueNumber] = useState('');
  const [queueValidating, setQueueValidating] = useState(false);
  const [queueValid, setQueueValid] = useState<boolean | null>(null);

  console.log('RegistrationPage loaded - Version 2.0 with Queue Validation');

  const [formData, setFormData] = useState({
    jenis_kunjungan: '',
    jenis_pasien: '',
    poli_tujuan: '',
    keluhan_utama: '',
  });

  const handleValidateQueue = async () => {
    if (!queueNumber.trim()) {
      showToast('Mohon masukkan nomor antrian', 'error');
      return;
    }

    if (!selectedPatient) {
      showToast('Silakan pilih pasien terlebih dahulu', 'error');
      return;
    }

    setQueueValidating(true);
    try {
      const todayQueues = await QueueService.getTodayQueues('B');
      const matchedQueue = todayQueues.find(
        (q) =>
          q.full_queue_code.toUpperCase() === queueNumber.trim().toUpperCase() &&
          q.patient_id === selectedPatient.id_pasien
      );

      if (matchedQueue) {
        setQueueValid(true);
        showToast('Nomor antrian valid!', 'success');
      } else {
        setQueueValid(false);
        showToast(
          'Nomor antrian tidak cocok. Anda masih bisa melanjutkan.',
          'info'
        );
      }
    } catch (error: any) {
      console.error('Error validating queue:', error);
      setQueueValid(false);
      showToast('Gagal validasi. Anda masih bisa melanjutkan.', 'info');
    } finally {
      setQueueValidating(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr) as User;
      setUser(parsedUser);
      loadData();
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients([]);
      setShowPatientList(false);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = patients.filter(
        (patient) =>
          patient.nama_lengkap.toLowerCase().includes(query) ||
          patient.no_rm.toLowerCase().includes(query) ||
          patient.nik.toLowerCase().includes(query)
      );
      setFilteredPatients(filtered);
      setShowPatientList(true);
    }
  }, [searchQuery, patients]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patientsData, registrationsData] = await Promise.all([
        PatientService.getAllPatients(),
        RegistrationService.getTodayRegistrations(),
      ]);
      setPatients(patientsData);
      setTodayRegistrations(registrationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery(`${patient.no_rm} - ${patient.nama_lengkap}`);
    setShowPatientList(false);
    setQueueNumber('');
    setQueueValid(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert('Pilih pasien terlebih dahulu');
      return;
    }

    if (!formData.jenis_kunjungan || !formData.jenis_pasien || !formData.poli_tujuan) {
      alert('Lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const input: CreateRegistrationInput = {
        id_pasien: selectedPatient.id_pasien,
        jenis_kunjungan: formData.jenis_kunjungan,
        jenis_pasien: formData.jenis_pasien,
        poli_tujuan: formData.poli_tujuan,
        keluhan_utama: formData.keluhan_utama,
        metadata_user_buat: user?.id,
      };

      const registration = await RegistrationService.createRegistration(input);
      const fullRegistration = await RegistrationService.getRegistrationById(registration.id_registrasi);

      setLastRegistration(fullRegistration);
      setShowSuccess(true);
      loadData();
      resetForm();
    } catch (error) {
      console.error('Failed to create registration:', error);
      alert('Gagal membuat registrasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setSearchQuery('');
    setQueueNumber('');
    setQueueValid(null);
    setFormData({
      jenis_kunjungan: '',
      jenis_pasien: '',
      poli_tujuan: '',
      keluhan_utama: '',
    });
  };

  const handlePrint = () => {
    if (!lastRegistration) return;

    const printContent = document.getElementById('print-area');
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Nomor Antrian</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              text-align: center;
            }
            .ticket {
              border: 2px solid #333;
              padding: 30px;
              max-width: 400px;
              margin: 0 auto;
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .queue-number {
              font-size: 72px;
              font-weight: bold;
              color: #2563eb;
              margin: 30px 0;
            }
            .info {
              text-align: left;
              margin-top: 20px;
              font-size: 14px;
            }
            .info-row {
              margin: 8px 0;
              display: flex;
              justify-content: space-between;
            }
            .label {
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Dipanggil':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'Selesai':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Batal':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dipanggil':
        return 'bg-blue-100 text-blue-800';
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Batal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Registrasi Kunjungan</h1>
          <p className="text-slate-600 mt-1">
            Daftarkan kunjungan pasien dan cetak nomor antrian
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Form Registrasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="patient-search">Cari Pasien</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="patient-search"
                        placeholder="Cari berdasarkan No. RM, NIK, atau Nama..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {showPatientList && filteredPatients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredPatients.map((patient) => (
                          <button
                            key={patient.id_pasien}
                            type="button"
                            onClick={() => handleSelectPatient(patient)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b last:border-b-0"
                          >
                            <div className="font-medium text-slate-900">
                              {patient.nama_lengkap}
                            </div>
                            <div className="text-sm text-slate-600">
                              No. RM: {patient.no_rm} | NIK: {patient.nik}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedPatient && (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="font-semibold text-blue-900 mb-2">
                          Pasien Terpilih
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">No. RM:</span>{' '}
                            <span className="font-medium">{selectedPatient.no_rm}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">NIK:</span>{' '}
                            <span className="font-medium">{selectedPatient.nik}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Nama:</span>{' '}
                            <span className="font-medium">{selectedPatient.nama_lengkap}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Umur:</span>{' '}
                            <span className="font-medium">
                              {RegistrationService.calculateAge(selectedPatient.tgl_lahir)} tahun
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label htmlFor="queue_number" className="text-sm">
                          Nomor Antrian (Opsional - untuk validasi dari tiket APM)
                        </Label>
                        <p className="text-xs text-slate-500 mb-2">
                          Masukkan nomor dari tiket APM Counter B. Anda tetap bisa melanjutkan tanpa validasi.
                        </p>
                        <div className="flex gap-2">
                          <Input
                            id="queue_number"
                            placeholder="B001"
                            value={queueNumber}
                            onChange={(e) => setQueueNumber(e.target.value.toUpperCase())}
                            maxLength={4}
                            className="flex-1"
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
                              Nomor tidak cocok. Anda tetap bisa melanjutkan.
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="jenis_kunjungan">Jenis Kunjungan</Label>
                    <Select
                      value={formData.jenis_kunjungan}
                      onValueChange={(value) =>
                        setFormData({ ...formData, jenis_kunjungan: value })
                      }
                    >
                      <SelectTrigger id="jenis_kunjungan">
                        <SelectValue placeholder="Pilih jenis kunjungan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rawat Jalan">Rawat Jalan</SelectItem>
                        <SelectItem value="IGD">IGD (Instalasi Gawat Darurat)</SelectItem>
                        <SelectItem value="Rawat Inap">Rawat Inap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="jenis_pasien">Jenis Pasien</Label>
                    <Select
                      value={formData.jenis_pasien}
                      onValueChange={(value) =>
                        setFormData({ ...formData, jenis_pasien: value })
                      }
                    >
                      <SelectTrigger id="jenis_pasien">
                        <SelectValue placeholder="Pilih jenis pasien" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Umum">Umum</SelectItem>
                        <SelectItem value="BPJS">BPJS</SelectItem>
                        <SelectItem value="Asuransi">Asuransi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="poli_tujuan">Poli Tujuan</Label>
                    <Select
                      value={formData.poli_tujuan}
                      onValueChange={(value) =>
                        setFormData({ ...formData, poli_tujuan: value })
                      }
                    >
                      <SelectTrigger id="poli_tujuan">
                        <SelectValue placeholder="Pilih poli tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Poli Umum">Poli Umum</SelectItem>
                        <SelectItem value="Poli Gigi">Poli Gigi</SelectItem>
                        <SelectItem value="Poli KIA">Poli KIA</SelectItem>
                        <SelectItem value="Poli Anak">Poli Anak</SelectItem>
                        <SelectItem value="Poli Mata">Poli Mata</SelectItem>
                        <SelectItem value="Poli THT">Poli THT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="keluhan_utama">Keluhan Utama</Label>
                    <textarea
                      id="keluhan_utama"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tuliskan keluhan utama pasien..."
                      value={formData.keluhan_utama}
                      onChange={(e) =>
                        setFormData({ ...formData, keluhan_utama: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading || !selectedPatient}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Daftar Sekarang
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Antrian Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayRegistrations.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      Belum ada registrasi hari ini
                    </p>
                  ) : (
                    todayRegistrations.slice(0, 10).map((reg) => (
                      <div
                        key={reg.id_registrasi}
                        className="p-3 bg-slate-50 rounded-lg border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-2xl font-bold text-blue-600">
                            {reg.no_antrian}
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(reg.status_registrasi)}`}>
                            {getStatusIcon(reg.status_registrasi)}
                            {reg.status_registrasi}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-slate-900">
                          {reg.pasien.nama_lengkap}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {reg.poli_tujuan} | {formatTime(reg.waktu_registrasi)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showSuccess && lastRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Registrasi Berhasil!</CardTitle>
              </CardHeader>
              <CardContent>
                <div id="print-area">
                  <div className="ticket">
                    <div className="header">NOMOR ANTRIAN</div>
                    <div className="queue-number">{lastRegistration.no_antrian}</div>
                    <div className="info">
                      <div className="info-row">
                        <span className="label">No. RM:</span>
                        <span>{lastRegistration.pasien.no_rm}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Nama:</span>
                        <span>{lastRegistration.pasien.nama_lengkap}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Poli:</span>
                        <span>{lastRegistration.poli_tujuan}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Tanggal:</span>
                        <span>{formatDate(lastRegistration.tgl_registrasi)}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Waktu:</span>
                        <span>{formatTime(lastRegistration.waktu_registrasi)}</span>
                      </div>
                    </div>
                    <div className="footer">
                      Harap menunggu nomor antrian dipanggil
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handlePrint} className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Antrian
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSuccess(false);
                      setLastRegistration(null);
                    }}
                    className="flex-1"
                  >
                    Tutup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="hidden">
        <div ref={printRef} id="print-content" />
      </div>
    </PageWrapper>
  );
};
