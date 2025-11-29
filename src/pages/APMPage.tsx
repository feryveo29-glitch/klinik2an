import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, FileSearch, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export const APMPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'new' | 'existing' | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <img
            src="/logo-dewata-1.png"
            alt="Logo"
            className="h-24 mx-auto mb-6"
          />
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Alat Pendaftaran Mandiri
          </h1>
          <p className="text-2xl text-slate-600">
            Silakan pilih jenis pendaftaran Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={handleNewPatient}
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-12 border-4 ${
              selectedOption === 'new'
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
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-12 border-4 ${
              selectedOption === 'existing'
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

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-lg">
            Sentuh salah satu pilihan di atas untuk melanjutkan
          </p>
        </div>
      </div>
    </div>
  );
};
