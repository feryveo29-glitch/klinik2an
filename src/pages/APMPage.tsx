import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, FileSearch, ArrowRight, Calendar, Clock, Activity } from 'lucide-react';
import { facilityService } from '../services/facility.service';
import { RegistrationService, type RegistrationWithPatient } from '../services/registration.service';

export const APMPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'new' | 'existing' | null>(null);
  const [facilityName, setFacilityName] = useState('Klinik Pratama');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeQueues, setActiveQueues] = useState<RegistrationWithPatient[]>([]);

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

    const fetchQueues = async () => {
      try {
        const data = await RegistrationService.getTodayRegistrations();
        // Filter hanya yang Menunggu atau Dipanggil
        const active = data.filter(r => r.status_registrasi === 'Menunggu' || r.status_registrasi === 'Dipanggil');
        // Ambil 5 antrian terakhir/terbaru untuk ditampilkan
        setActiveQueues(active.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch queues:', error);
      }
    };

    fetchProfile();
    fetchQueues();

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    const queueTimer = setInterval(fetchQueues, 10000); // Refresh antrian setiap 10 detik

    return () => {
      clearInterval(timer);
      clearInterval(queueTimer);
    };
  }, []);

  const handleNewPatient = () => {
    setSelectedOption('new');
    setTimeout(() => {
      navigate('/apm/new-patient');
    }, 300);
  };

  const handleExistingPatient = () => {
    setSelectedOption('existing');
    setTimeout(() => {
      navigate('/apm/existing-patient');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Selamat Datang
          </h1>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">{facilityName}</h2>
            <div className="flex items-center justify-center gap-6 text-xl text-slate-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>


          </div>

          <p className="text-2xl text-slate-600">
            Silakan pilih jenis pendaftaran Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={handleNewPatient}
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-12 border-4 ${selectedOption === 'new'
              ? 'border-blue-500 scale-105'
              : 'border-transparent hover:border-blue-200'
              }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserPlus className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Pasien Baru
              </h2>
              <p className="text-xl text-slate-600 mb-6">
                Untuk pasien yang pertama kali berkunjung
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-lg">
                <span>Lanjut ke Counter A</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            <div className="absolute top-6 right-6 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-lg">
              Counter A
            </div>
          </button>

          <button
            onClick={handleExistingPatient}
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-12 border-4 ${selectedOption === 'existing'
              ? 'border-green-500 scale-105'
              : 'border-transparent hover:border-green-200'
              }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileSearch className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Pasien Lama
              </h2>
              <p className="text-xl text-slate-600 mb-6">
                Untuk pasien yang sudah pernah terdaftar
              </p>
              <div className="flex items-center text-green-600 font-semibold text-lg">
                <span>Lanjut ke Counter B</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            <div className="absolute top-6 right-6 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-lg">
              Counter B
            </div>
          </button>
        </div>

        {/* Queue Progress Display */}
        {activeQueues.length > 0 && (
          <div className="mt-12 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
              <h3 className="font-semibold text-slate-700">Status Antrian Terkini</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {activeQueues.map((queue) => (
                <div key={queue.id_registrasi} className="px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${queue.status_registrasi === 'Dipanggil'
                      ? 'bg-green-100 text-green-600 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                      }`}>
                      {queue.no_antrian}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">{queue.pasien.nama_lengkap}</p>
                      <p className="text-sm text-slate-500">{queue.poli_tujuan}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${queue.status_registrasi === 'Dipanggil'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                    {queue.status_registrasi === 'Dipanggil' ? 'Sedang dalam pelayanan' : 'Sedang menunggu pelayanan'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-lg mb-8">
            Sentuh salah satu pilihan di atas untuk melanjutkan
          </p>

          <button
            onClick={() => navigate('/login')}
            className="text-slate-300 hover:text-slate-500 text-sm transition-colors duration-300 p-4"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};
