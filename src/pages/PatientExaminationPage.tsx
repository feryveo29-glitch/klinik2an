import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/simple-tabs';
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
import {
  FileText,
  Search,
  Loader2,
  CheckCircle2,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';
import { PatientService, type Patient } from '../services/patient.service';
import { MedicalRecordsService } from '../services/medical-records.service';
import { DummyDataService } from '../services/dummy-data.service';
import { RegistrationService, type RegistrationWithPatient } from '../services/registration.service';
import type { User } from '../types/auth.types';

export const PatientExaminationPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  console.log('PatientExaminationPage - User:', user);
  console.log('PatientExaminationPage - Is Admin:', user?.role?.toLowerCase() === 'admin');

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [activeTab, setActiveTab] = useState('kunjungan');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [queueNumber, setQueueNumber] = useState('');
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationWithPatient | null>(null);

  const [formData, setFormData] = useState({
    tgl_kunjungan: '',
    jenis_kunjungan: '',
    jenis_pasien: '',
    unit_pelayanan: '',
    tenaga_medis_pj: '',
    keluhan_utama: '',
    rps: '',
    rpd: '',
    riwayat_obat: '',
    riwayat_alergi: '',
    td_sistol: '',
    td_diastol: '',
    nadi: '',
    respiratory_rate: '',
    suhu: '',
    tinggi_badan: '',
    berat_badan: '',
    pemeriksaan_fisik: '',
    hasil_penunjang_file: '',
    catatan_klinis: '',
    icd10_code: '',
    diagnosis_name: '',
    rencana_terapi: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr) as User;
      setUser(parsedUser);
      loadPatients();
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

  const loadPatients = async () => {
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery(`${patient.no_rm} - ${patient.nama_lengkap}`);
    setShowPatientList(false);
    setRegistrationData(null); // Clear registration data when manually selecting patient
  };

  const handleSearchByQueue = async () => {
    if (!queueNumber.trim()) {
      alert('Masukkan nomor antrian');
      return;
    }

    setLoadingQueue(true);
    try {
      const registration = await RegistrationService.getRegistrationByQueueNumber(queueNumber);

      if (!registration) {
        alert('Nomor antrian tidak ditemukan atau sudah selesai');
        setLoadingQueue(false);
        return;
      }

      // Set patient data from registration
      const patientData = registration.pasien as any;
      setSelectedPatient(patientData);
      setSearchQuery(`${patientData.no_rm} - ${patientData.nama_lengkap}`);
      setRegistrationData(registration);

      // Auto-fill form data from registration
      setFormData(prev => ({
        ...prev,
        tgl_kunjungan: new Date().toISOString().slice(0, 16),
        jenis_kunjungan: registration.jenis_kunjungan,
        jenis_pasien: registration.jenis_pasien,
        unit_pelayanan: registration.poli_tujuan,
        keluhan_utama: registration.keluhan_utama || '',
      }));

      alert('Data registrasi berhasil dimuat!');
    } catch (error) {
      console.error('Error searching by queue:', error);
      alert('Gagal mencari nomor antrian');
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateSubjektif = () => {
    const data = DummyDataService.generateSOAPSubjektif();
    setFormData(prev => ({
      ...prev,
      keluhan_utama: data.keluhan_utama,
      rps: data.riwayat_penyakit_sekarang,
      rpd: data.riwayat_penyakit_dahulu,
      riwayat_obat: data.riwayat_pengobatan,
      riwayat_alergi: data.riwayat_alergi,
    }));
  };

  const handleGenerateObjektif = () => {
    const data = DummyDataService.generateSOAPObjektif();
    const [sistol, diastol] = data.tekanan_darah.split('/');
    setFormData(prev => ({
      ...prev,
      td_sistol: sistol.trim(),
      td_diastol: diastol.replace(' mmHg', '').trim(),
      nadi: data.nadi.replace(' x/menit', '').trim(),
      respiratory_rate: data.pernapasan.replace(' x/menit', '').trim(),
      suhu: data.suhu.replace('°C', '').trim(),
      tinggi_badan: data.tinggi_badan.replace(' cm', '').trim(),
      berat_badan: data.berat_badan.replace(' kg', '').trim(),
      pemeriksaan_fisik: data.pemeriksaan_fisik_umum,
    }));
  };

  const handleGenerateDiagnosis = () => {
    const data = DummyDataService.generateDiagnosis();
    setFormData(prev => ({
      ...prev,
      icd10_code: data.kode_icd10,
      diagnosis_name: data.diagnosis_utama,
    }));
  };

  const handleGeneratePlan = () => {
    const data = DummyDataService.generatePlanTerapi();
    setFormData(prev => ({
      ...prev,
      rencana_terapi: data.terapi_farmakologi,
      catatan_klinis: `${data.terapi_non_farmakologi}\n\n${data.rencana_tindak_lanjut}\n\nPrognosis: ${data.prognosis}`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert('Pilih pasien terlebih dahulu');
      return;
    }

    if (
      !formData.tgl_kunjungan ||
      !formData.jenis_kunjungan ||
      !formData.jenis_pasien ||
      !formData.unit_pelayanan ||
      !formData.tenaga_medis_pj
    ) {
      alert('Lengkapi data kunjungan yang wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const result = await MedicalRecordsService.createMedicalRecord({
        patientId: selectedPatient.id_pasien,
        kunjungan: {
          tgl_kunjungan: formData.tgl_kunjungan,
          jenis_kunjungan: formData.jenis_kunjungan,
          jenis_pasien: formData.jenis_pasien,
          unit_pelayanan: formData.unit_pelayanan,
          tenaga_medis_pj: formData.tenaga_medis_pj,
          metadata_user_buat: user?.id,
        },
        subjektif: {
          keluhan_utama: formData.keluhan_utama,
          rps: formData.rps,
          rpd: formData.rpd,
          riwayat_obat: formData.riwayat_obat,
          riwayat_alergi: formData.riwayat_alergi,
        },
        objektif: {
          td_sistol: formData.td_sistol ? parseInt(formData.td_sistol) : null,
          td_diastol: formData.td_diastol ? parseInt(formData.td_diastol) : null,
          nadi: formData.nadi ? parseInt(formData.nadi) : null,
          respiratory_rate: formData.respiratory_rate
            ? parseInt(formData.respiratory_rate)
            : null,
          suhu: formData.suhu ? parseFloat(formData.suhu) : null,
          tinggi_badan: formData.tinggi_badan ? parseInt(formData.tinggi_badan) : null,
          berat_badan: formData.berat_badan ? parseFloat(formData.berat_badan) : null,
          pemeriksaan_fisik: formData.pemeriksaan_fisik,
        },
        penunjang: {
          hasil_file: formData.hasil_penunjang_file,
          catatan_klinis: formData.catatan_klinis,
        },
        diagnosis: {
          kode_icd10: formData.icd10_code,
          nama_diagnosis: formData.diagnosis_name,
        },
        plan: {
          rencana_terapi: formData.rencana_terapi,
        },
      });

      // If this examination is from a registration, link them
      if (registrationData && result?.kunjunganId) {
        try {
          await RegistrationService.linkToVisit(
            registrationData.id_registrasi,
            result.kunjunganId
          );
        } catch (linkError) {
          console.error('Failed to link registration to visit:', linkError);
          // Don't fail the whole process if linking fails
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/patients/${selectedPatient.id_pasien}`);
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create medical record:', error);
      alert(error.message || 'Gagal menyimpan rekam medis. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
                Rekam Medis Berhasil Disimpan!
              </h2>
              <p className="text-slate-600">
                Data pemeriksaan telah tersimpan. Anda akan diarahkan ke riwayat input...
              </p>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-8 h-8" />
            Pemeriksaan Pasien
          </CardTitle>
          <p className="text-slate-600 mt-1">
            Input data SOAP dan diagnosis pasien
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="kunjungan">Data Kunjungan</TabsTrigger>
                <TabsTrigger value="subjektif">SOAP Subjektif</TabsTrigger>
                <TabsTrigger value="objektif">SOAP Objektif</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                <TabsTrigger value="plan">Plan & Terapi</TabsTrigger>
              </TabsList>

              <TabsContent value="kunjungan" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">Pilih Pasien</h3>

                  {/* Search by Queue Number */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Label htmlFor="queue-search" className="text-blue-900 font-semibold">
                      Cari Berdasarkan Nomor Antrian
                    </Label>
                    <p className="text-xs text-blue-700 mb-2">
                      Masukkan nomor antrian dari registrasi (contoh: A001)
                    </p>
                    <div className="flex gap-2">
                      <Input
                        id="queue-search"
                        placeholder="A001"
                        value={queueNumber}
                        onChange={(e) => setQueueNumber(e.target.value.toUpperCase())}
                        maxLength={4}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleSearchByQueue}
                        disabled={loadingQueue || !queueNumber}
                      >
                        {loadingQueue ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Mencari...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Cari
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-slate-500">atau</div>

                  {/* Search by Name/RM/NIK */}
                  <div className="relative">
                    <Label htmlFor="patient-search">Cari Pasien Manual</Label>
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
                            <span className="font-medium">
                              {selectedPatient.nama_lengkap}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Umur:</span>{' '}
                            <span className="font-medium">
                              {PatientService.calculateAge(selectedPatient.tgl_lahir)} tahun
                            </span>
                          </div>
                        </div>
                      </div>

                      {registrationData && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-900">
                              Data dari Registrasi: {registrationData.no_antrian}
                            </span>
                          </div>
                          <div className="text-sm text-green-800 space-y-1">
                            <p>Waktu Registrasi: {new Date(registrationData.waktu_registrasi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p>Status: {registrationData.status_registrasi}</p>
                            <p className="text-xs mt-2 text-green-700">Data kunjungan telah diisi otomatis dari registrasi</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">Data Kunjungan</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tgl_kunjungan">Tanggal Kunjungan *</Label>
                      <Input
                        id="tgl_kunjungan"
                        type="datetime-local"
                        value={formData.tgl_kunjungan}
                        onChange={(e) => handleInputChange('tgl_kunjungan', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jenis_kunjungan">Jenis Kunjungan *</Label>
                      <Select
                        value={formData.jenis_kunjungan}
                        onValueChange={(value) =>
                          handleInputChange('jenis_kunjungan', value)
                        }
                      >
                        <SelectTrigger id="jenis_kunjungan">
                          <SelectValue placeholder="Pilih Jenis Kunjungan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rawat Jalan">Rawat Jalan</SelectItem>
                          <SelectItem value="IGD">IGD</SelectItem>
                          <SelectItem value="Rawat Inap">Rawat Inap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jenis_pasien">Jenis Pasien *</Label>
                      <Select
                        value={formData.jenis_pasien}
                        onValueChange={(value) => handleInputChange('jenis_pasien', value)}
                      >
                        <SelectTrigger id="jenis_pasien">
                          <SelectValue placeholder="Pilih Jenis Pasien" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Umum">Umum</SelectItem>
                          <SelectItem value="BPJS">BPJS</SelectItem>
                          <SelectItem value="Asuransi">Asuransi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit_pelayanan">Unit Pelayanan *</Label>
                      <Select
                        value={formData.unit_pelayanan}
                        onValueChange={(value) =>
                          handleInputChange('unit_pelayanan', value)
                        }
                      >
                        <SelectTrigger id="unit_pelayanan">
                          <SelectValue placeholder="Pilih Unit Pelayanan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Poli Umum">Poli Umum</SelectItem>
                          <SelectItem value="Poli Gigi">Poli Gigi</SelectItem>
                          <SelectItem value="Poli KIA">Poli KIA</SelectItem>
                          <SelectItem value="Poli Anak">Poli Anak</SelectItem>
                          <SelectItem value="IGD">IGD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tenaga_medis_pj">
                        Tenaga Medis Penanggung Jawab *
                      </Label>
                      <Input
                        id="tenaga_medis_pj"
                        type="text"
                        placeholder="Nama dokter/tenaga medis"
                        value={formData.tenaga_medis_pj}
                        onChange={(e) =>
                          handleInputChange('tenaga_medis_pj', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab('subjektif')}
                      disabled={!selectedPatient}
                    >
                      Lanjut ke SOAP Subjektif
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subjektif" className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-xl font-semibold">SOAP Subjektif</h3>
                  {isAdmin && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSubjektif}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keluhan_utama">Keluhan Utama</Label>
                    <textarea
                      id="keluhan_utama"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Keluhan utama pasien..."
                      value={formData.keluhan_utama}
                      onChange={(e) => handleInputChange('keluhan_utama', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rps">Riwayat Penyakit Sekarang (RPS)</Label>
                    <textarea
                      id="rps"
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Riwayat penyakit sekarang..."
                      value={formData.rps}
                      onChange={(e) => handleInputChange('rps', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rpd">Riwayat Penyakit Dahulu (RPD)</Label>
                    <textarea
                      id="rpd"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Riwayat penyakit dahulu..."
                      value={formData.rpd}
                      onChange={(e) => handleInputChange('rpd', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riwayat_obat">Riwayat Penggunaan Obat</Label>
                    <textarea
                      id="riwayat_obat"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Riwayat penggunaan obat..."
                      value={formData.riwayat_obat}
                      onChange={(e) => handleInputChange('riwayat_obat', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riwayat_alergi">Riwayat Alergi</Label>
                    <textarea
                      id="riwayat_alergi"
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Riwayat alergi (obat, makanan, dll)..."
                      value={formData.riwayat_alergi}
                      onChange={(e) => handleInputChange('riwayat_alergi', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('kunjungan')}
                    >
                      Kembali
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('objektif')}>
                      Lanjut ke SOAP Objektif
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="objektif" className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-xl font-semibold">SOAP Objektif</h3>
                  {isAdmin && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateObjektif}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Tanda Vital</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="td_sistol">TD Sistol (mmHg)</Label>
                      <Input
                        id="td_sistol"
                        type="number"
                        placeholder="120"
                        value={formData.td_sistol}
                        onChange={(e) => handleInputChange('td_sistol', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="td_diastol">TD Diastol (mmHg)</Label>
                      <Input
                        id="td_diastol"
                        type="number"
                        placeholder="80"
                        value={formData.td_diastol}
                        onChange={(e) => handleInputChange('td_diastol', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nadi">Nadi (x/menit)</Label>
                      <Input
                        id="nadi"
                        type="number"
                        placeholder="80"
                        value={formData.nadi}
                        onChange={(e) => handleInputChange('nadi', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="respiratory_rate">Resp. Rate (x/menit)</Label>
                      <Input
                        id="respiratory_rate"
                        type="number"
                        placeholder="20"
                        value={formData.respiratory_rate}
                        onChange={(e) =>
                          handleInputChange('respiratory_rate', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suhu">Suhu (°C)</Label>
                      <Input
                        id="suhu"
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={formData.suhu}
                        onChange={(e) => handleInputChange('suhu', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
                      <Input
                        id="tinggi_badan"
                        type="number"
                        placeholder="170"
                        value={formData.tinggi_badan}
                        onChange={(e) => handleInputChange('tinggi_badan', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
                      <Input
                        id="berat_badan"
                        type="number"
                        step="0.1"
                        placeholder="65"
                        value={formData.berat_badan}
                        onChange={(e) => handleInputChange('berat_badan', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pemeriksaan_fisik">Pemeriksaan Fisik</Label>
                    <textarea
                      id="pemeriksaan_fisik"
                      rows={5}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Hasil pemeriksaan fisik lengkap..."
                      value={formData.pemeriksaan_fisik}
                      onChange={(e) =>
                        handleInputChange('pemeriksaan_fisik', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hasil_penunjang_file">
                      Hasil Pemeriksaan Penunjang (File/Link)
                    </Label>
                    <Input
                      id="hasil_penunjang_file"
                      type="text"
                      placeholder="URL file atau link hasil lab/radiologi"
                      value={formData.hasil_penunjang_file}
                      onChange={(e) =>
                        handleInputChange('hasil_penunjang_file', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="catatan_klinis">Catatan Klinis</Label>
                    <textarea
                      id="catatan_klinis"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan klinis tambahan..."
                      value={formData.catatan_klinis}
                      onChange={(e) => handleInputChange('catatan_klinis', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('subjektif')}
                    >
                      Kembali
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('diagnosis')}>
                      Lanjut ke Diagnosis
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="diagnosis" className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-xl font-semibold">Diagnosis</h3>
                  {isAdmin && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDiagnosis}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="icd10_code">Kode ICD-10</Label>
                    <Input
                      id="icd10_code"
                      type="text"
                      placeholder="Contoh: J00"
                      value={formData.icd10_code}
                      onChange={(e) => handleInputChange('icd10_code', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis_name">Nama Diagnosis</Label>
                    <Input
                      id="diagnosis_name"
                      type="text"
                      placeholder="Contoh: Acute nasopharyngitis [common cold]"
                      value={formData.diagnosis_name}
                      onChange={(e) => handleInputChange('diagnosis_name', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('objektif')}
                    >
                      Kembali
                    </Button>
                    <Button type="button" onClick={() => setActiveTab('plan')}>
                      Lanjut ke Plan & Terapi
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-xl font-semibold">Plan & Terapi</h3>
                  {isAdmin && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePlan}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rencana_terapi">Rencana Terapi & Tindakan</Label>
                    <textarea
                      id="rencana_terapi"
                      rows={8}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Rencana terapi, obat yang diberikan, dan tindakan medis..."
                      value={formData.rencana_terapi}
                      onChange={(e) => handleInputChange('rencana_terapi', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab('diagnosis')}
                    >
                      Kembali
                    </Button>
                    <Button type="submit" disabled={loading || !selectedPatient}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Simpan Rekam Medis
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
