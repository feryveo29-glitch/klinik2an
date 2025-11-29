import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Calendar,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  FileText,
  Loader2,
  User,
  Eye,
  Printer,
  X,
} from 'lucide-react';
import { PatientService, type PatientDetail } from '../services/patient.service';
import { medicalRecordsService, type KunjunganWithRelations } from '../services/medical-records.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../components/ui/toast';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<KunjunganWithRelations | null>(null);
  const [visitDetailLoading, setVisitDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadPatientDetail(id);
    } else {
      showToast('ID Pasien tidak valid', 'error');
      navigate('/dashboard');
    }
  }, [id]);

  const loadPatientDetail = async (patientId: string) => {
    setLoading(true);
    try {
      const data = await PatientService.getPatientById(patientId);
      if (!data) {
        showToast('Data pasien tidak ditemukan', 'error');
        navigate('/dashboard');
        return;
      }
      setPatient(data);
    } catch (error: any) {
      console.error('Failed to load patient detail:', error);
      showToast(`Error: ${error.message || 'Gagal memuat data pasien'}`, 'error');
      navigate('/dashboard');
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

  const calculateAge = (birthDate: string) => {
    return PatientService.calculateAge(birthDate);
  };

  const handleViewDetail = async (visitId: string) => {
    setVisitDetailLoading(true);
    setShowDetailModal(true);
    setSelectedVisit(null);
    try {
      const detail = await medicalRecordsService.getRecordById(visitId);
      if (!detail) {
        showToast('Detail kunjungan tidak ditemukan', 'error');
        setShowDetailModal(false);
        return;
      }
      setSelectedVisit(detail);
    } catch (error: any) {
      console.error('Failed to load visit detail:', error);
      showToast(`Error: ${error.message || 'Gagal memuat detail kunjungan'}`, 'error');
      setShowDetailModal(false);
    } finally {
      setVisitDetailLoading(false);
    }
  };

  const handlePrintVisit = () => {
    if (!selectedVisit) {
      showToast('Tidak ada data untuk dicetak', 'error');
      return;
    }

    try {
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error: any) {
      showToast('Gagal mencetak dokumen', 'error');
      console.error('Print error:', error);
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setTimeout(() => {
      setSelectedVisit(null);
      setVisitDetailLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Data pasien tidak ditemukan</p>
        <Button onClick={() => navigate('/patients')} className="mt-4">
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
          onClick={() => navigate('/patients')}
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
              <CardTitle className="text-2xl">{patient.nama_lengkap}</CardTitle>
              <p className="text-slate-600 mt-1">
                No. RM: <span className="font-semibold">{patient.no_rm}</span>
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {patient.nama_lengkap.charAt(0).toUpperCase()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">NIK</p>
                  <p className="font-medium text-slate-900">{patient.nik}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Tanggal Lahir / Umur</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(patient.tgl_lahir)} ({calculateAge(patient.tgl_lahir)}{' '}
                    tahun)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Jenis Kelamin</p>
                  <p className="font-medium text-slate-900">
                    {patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Pekerjaan</p>
                  <p className="font-medium text-slate-900">
                    {patient.pekerjaan || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Pendidikan</p>
                  <p className="font-medium text-slate-900">
                    {patient.pendidikan || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Status Perkawinan</p>
                  <p className="font-medium text-slate-900">
                    {patient.status_kawin || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">No. HP</p>
                  <p className="font-medium text-slate-900">
                    {patient.no_hp || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Alamat</p>
                  <p className="font-medium text-slate-900">
                    {patient.alamat || '-'}
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
            Riwayat Kunjungan ({patient.kunjungan.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient.kunjungan.length > 0 ? (
            <div className="space-y-4">
              {patient.kunjungan.map((kunjungan) => (
                <div
                  key={kunjungan.id_kunjungan}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatDateTime(kunjungan.tgl_kunjungan)}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {kunjungan.unit_pelayanan} • {kunjungan.jenis_kunjungan}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        kunjungan.jenis_pasien === 'BPJS'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {kunjungan.jenis_pasien}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Tenaga Medis</p>
                      <p className="font-medium text-slate-900">
                        {kunjungan.tenaga_medis_pj}
                      </p>
                    </div>

                    {kunjungan.mahasiswa && (
                      <div>
                        <p className="text-slate-500">Input oleh</p>
                        <p className="font-medium text-slate-900">
                          {kunjungan.mahasiswa.full_name}
                        </p>
                      </div>
                    )}
                  </div>

                  {kunjungan.diagnosis && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-slate-500 mb-1">Diagnosis</p>
                      <p className="font-medium text-slate-900">
                        {kunjungan.diagnosis.kode_icd10}:{' '}
                        {kunjungan.diagnosis.nama_diagnosis}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(kunjungan.id_kunjungan)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>Belum ada riwayat kunjungan</p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      <Dialog open={showDetailModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Detail Rekam Medis</DialogTitle>
              <div className="flex gap-2 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintVisit}
                  disabled={!selectedVisit}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-6 pb-6">
          {visitDetailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : selectedVisit ? (
            <div className="space-y-6" id="print-area">
              <div className="border-b pb-4">
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Informasi Pasien
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">No. RM:</span>{' '}
                    <span className="font-medium">{patient?.no_rm}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Nama:</span>{' '}
                    <span className="font-medium">{patient?.nama_lengkap}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Tanggal Kunjungan:</span>{' '}
                    <span className="font-medium">
                      {selectedVisit?.tgl_kunjungan ? formatDateTime(selectedVisit.tgl_kunjungan) : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Unit Pelayanan:</span>{' '}
                    <span className="font-medium">{selectedVisit?.unit_pelayanan || '-'}</span>
                  </div>
                </div>
              </div>

              {selectedVisit?.subjektif && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    SOAP Subjektif
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Keluhan Utama</p>
                      <p className="text-slate-900">
                        {selectedVisit.subjektif.keluhan_utama || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">
                        Riwayat Penyakit Sekarang (RPS)
                      </p>
                      <p className="text-slate-900">
                        {selectedVisit.subjektif.rps || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">
                        Riwayat Penyakit Dahulu (RPD)
                      </p>
                      <p className="text-slate-900">
                        {selectedVisit.subjektif.rpd || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">
                        Riwayat Penggunaan Obat
                      </p>
                      <p className="text-slate-900">
                        {selectedVisit.subjektif.riwayat_obat || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Riwayat Alergi</p>
                      <p className="text-slate-900">
                        {selectedVisit.subjektif.riwayat_alergi || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedVisit?.objektif && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    SOAP Objektif
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-600 font-medium mb-2">Tanda Vital</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-500">TD</p>
                          <p className="font-medium">
                            {selectedVisit.objektif.td_sistol || '-'}/
                            {selectedVisit.objektif.td_diastol || '-'} mmHg
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-500">Nadi</p>
                          <p className="font-medium">
                            {selectedVisit.objektif.nadi || '-'} x/menit
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-500">RR</p>
                          <p className="font-medium">
                            {selectedVisit.objektif.respiratory_rate || '-'} x/menit
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-500">Suhu</p>
                          <p className="font-medium">
                            {selectedVisit.objektif.suhu || '-'} °C
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-500">TB</p>
                          <p className="font-medium">
                            {selectedVisit.objektif.tinggi_badan || '-'} cm
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-500">BB</p>
                          <p className="font-medium">
                            {selectedVisit.objektif.berat_badan || '-'} kg
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Pemeriksaan Fisik</p>
                      <p className="text-slate-900">
                        {selectedVisit.objektif.pemeriksaan_fisik || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedVisit?.pemeriksaan_penunjang && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    Pemeriksaan Penunjang
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Hasil File/Link</p>
                      <p className="text-slate-900">
                        {selectedVisit.pemeriksaan_penunjang.hasil_file || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Catatan Klinis</p>
                      <p className="text-slate-900">
                        {selectedVisit.pemeriksaan_penunjang.catatan_klinis || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedVisit?.asesmen && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Diagnosis</h3>
                  <div className="space-y-2 text-sm">
                    {Array.isArray(selectedVisit.asesmen.diagnosis) &&
                    selectedVisit.asesmen.diagnosis.length > 0 ? (
                      selectedVisit.asesmen.diagnosis.map((diag: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 p-3 rounded">
                          <p className="font-medium text-slate-900">
                            {diag.kode_icd10}: {diag.nama_diagnosis}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">-</p>
                    )}
                  </div>
                </div>
              )}

              {selectedVisit?.plan && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    Plan & Terapi
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Rencana Terapi</p>
                      <p className="text-slate-900">
                        {selectedVisit.plan.rencana_terapi || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 text-xs text-slate-500">
                <p>
                  Input oleh: {selectedVisit?.uploader_name || 'Unknown'} pada{' '}
                  {selectedVisit?.created_at ? formatDateTime(selectedVisit.created_at) : (selectedVisit?.tgl_kunjungan ? formatDateTime(selectedVisit.tgl_kunjungan) : '-')}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>Detail kunjungan tidak ditemukan</p>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
