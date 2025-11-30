import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Printer, CheckCircle, Loader2, Calendar, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { QueueService, type QueueNumber } from '../services/queue.service';
import { PatientService, type Patient } from '../services/patient.service';
import { useToast } from '../components/ui/toast';
import { facilityService } from '../services/facility.service';

export const APMExistingPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchType, setSearchType] = useState<'no_rm' | 'nik' | 'no_bpjs'>('no_rm');
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [queueData, setQueueData] = useState<QueueNumber | null>(null);
  const [generating, setGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [facilityName, setFacilityName] = useState('Klinik Pratama');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await facilityService.getProfil();
        if (data) {
          setFacilityName(data.nama_fasyankes);
        }
      } catch (error) {
        console.error('Failed to fetch facility profile:', error);
      }
    };

    fetchProfile();

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (queueData) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [queueData]);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      showToast('Mohon masukkan data pencarian', 'error');
      return;
    }

    setSearching(true);
    try {
      const patients = await PatientService.getAllPatients();
      let foundPatient: Patient | null = null;

      if (searchType === 'no_rm') {
        foundPatient = patients.find((p) => p.no_rm === searchValue.trim()) || null;
      } else if (searchType === 'nik') {
        foundPatient = patients.find((p) => p.nik === searchValue.trim()) || null;
      } else if (searchType === 'no_bpjs') {
        foundPatient = patients.find((p) => p.no_bpjs === searchValue.trim()) || null;
      }

      if (foundPatient) {
        setPatient(foundPatient);
        showToast('Data pasien ditemukan', 'success');
      } else {
        showToast('Data pasien tidak ditemukan', 'error');
        setPatient(null);
      }
    } catch (error: any) {
      showToast(error.message || 'Gagal mencari data pasien', 'error');
      setPatient(null);
    } finally {
      setSearching(false);
    }
  };

  const handleGenerateQueue = async () => {
    if (!patient) {
      showToast('Silakan cari data pasien terlebih dahulu', 'error');
      return;
    }

    setGenerating(true);
    try {
      const queue = await QueueService.createQueueNumber('B', patient.id_pasien);
      setQueueData(queue);
      showToast('Nomor antrian berhasil dibuat', 'success');
    } catch (error: any) {
      showToast(error.message || 'Gagal membuat nomor antrian', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    navigate('/apm');
  };

  const handleReset = () => {
    setPatient(null);
    setQueueData(null);
    setSearchValue('');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (queueData && patient) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 print:hidden flex flex-col items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Nomor Antrian Anda
              </h1>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-green-600 mb-2">{facilityName}</h2>
                <div className="flex items-center justify-center gap-4 text-lg text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="w-px h-4 bg-slate-300"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl py-8 px-6 mb-6">
                <div className="text-6xl font-bold mb-2">{queueData.full_queue_code}</div>
                <div className="text-2xl font-medium">Counter B</div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-lg mb-3">Data Pasien:</h3>
                <div className="space-y-2 text-slate-700">
                  <p><span className="font-medium">No. RM:</span> {patient.no_rm}</p>
                  <p><span className="font-medium">Nama:</span> {patient.nama_lengkap}</p>
                  <p><span className="font-medium">NIK:</span> {patient.nik}</p>
                </div>
              </div>

              <p className="text-xl text-slate-600 mb-8">
                Silakan menuju <span className="font-bold text-green-600">Counter B</span> untuk registrasi kunjungan
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handlePrint}
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Printer className="w-6 h-6 mr-2" />
                  Cetak Ulang
                </Button>
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div id="print-area" className="hidden print:block w-full bg-white" ref={printRef}>
          <div className="p-8">
            <div className="text-center border-4 border-dashed border-slate-300 p-8">

              <h2 className="text-3xl font-bold mb-2">NOMOR ANTRIAN</h2>
              <div className="text-sm text-slate-600 mb-4">Registrasi Pasien Lama</div>

              <div className="bg-slate-100 rounded-xl py-6 px-4 mb-4">
                <div className="text-6xl font-bold text-slate-900 mb-2">
                  {queueData.full_queue_code}
                </div>
                <div className="text-2xl font-bold text-green-600">Counter B</div>
              </div>

              <div className="text-left bg-slate-50 p-4 rounded-lg mb-4">
                <div className="text-sm space-y-1">
                  <p><strong>No. RM:</strong> {patient.no_rm}</p>
                  <p><strong>Nama:</strong> {patient.nama_lengkap}</p>
                  <p><strong>NIK:</strong> {patient.nik}</p>
                </div>
              </div>

              <div className="text-sm text-slate-600 mb-2">
                {formatDateTime(queueData.created_at)}
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-4 mt-4">
                <p className="text-base font-medium">
                  Silakan menuju Counter B untuk registrasi kunjungan
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Button
          onClick={handleBackToHome}
          variant="ghost"
          size="lg"
          className="mb-8 text-lg"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Kembali
        </Button>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
            Cari Data Pasien
          </h1>

          <p className="text-xl text-slate-600 mb-8 text-center">
            Masukkan data untuk mencari informasi pasien
          </p>

          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-3 block">Cari Berdasarkan</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSearchType('no_rm')}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${searchType === 'no_rm'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  No. RM
                </button>
                <button
                  onClick={() => setSearchType('nik')}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${searchType === 'nik'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  NIK
                </button>
                <button
                  onClick={() => setSearchType('no_bpjs')}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${searchType === 'no_bpjs'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  No. BPJS
                </button>
              </div>
            </div>

            <div>
              <Label className="text-lg mb-3 block">
                {searchType === 'no_rm'
                  ? 'Nomor Rekam Medis'
                  : searchType === 'nik'
                    ? 'NIK'
                    : 'Nomor BPJS'}
              </Label>
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Masukkan ${searchType === 'no_rm' ? 'No. RM' : searchType === 'nik' ? 'NIK' : 'No. BPJS'
                  }`}
                className="text-xl p-6 h-auto"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={searching}
              size="lg"
              className="w-full text-xl py-6"
            >
              {searching ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6 mr-2" />
                  Cari Data Pasien
                </>
              )}
            </Button>

            {patient && (
              <div className="mt-8 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-xl mb-4 text-green-900">Data Ditemukan:</h3>
                <div className="space-y-2 text-slate-700 mb-6">
                  <p><span className="font-medium">No. RM:</span> {patient.no_rm}</p>
                  <p><span className="font-medium">Nama:</span> {patient.nama_lengkap}</p>
                  <p><span className="font-medium">NIK:</span> {patient.nik}</p>
                  <p><span className="font-medium">Tanggal Lahir:</span> {new Date(patient.tgl_lahir).toLocaleDateString('id-ID')}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerateQueue}
                    disabled={generating}
                    size="lg"
                    className="flex-1 text-lg py-6"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Ambil Nomor Antrian'
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="text-lg py-6"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
