import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle, Calendar, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { QueueService, type QueueNumber } from '../services/queue.service';
import { useToast } from '../components/ui/toast';
import { facilityService } from '../services/facility.service';

export const APMNewPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState<QueueNumber | null>(null);
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

  const handleGenerateQueue = async () => {
    setLoading(true);
    try {
      const queue = await QueueService.createQueueNumber('A');
      setQueueData(queue);
      showToast('Nomor antrian berhasil dibuat', 'success');
    } catch (error: any) {
      showToast(error.message || 'Gagal membuat nomor antrian', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    navigate('/apm');
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

  if (queueData) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 print:hidden flex flex-col items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Nomor Antrian Anda
              </h1>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">{facilityName}</h2>
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

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl py-8 px-6 mb-8">
                <div className="text-6xl font-bold mb-2">{queueData.full_queue_code}</div>
                <div className="text-2xl font-medium">Counter A</div>
              </div>

              <p className="text-xl text-slate-600 mb-8">
                Silakan menuju <span className="font-bold text-blue-600">Counter A</span> untuk pendaftaran pasien baru
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
              <div className="text-sm text-slate-600 mb-4">Pendaftaran Pasien Baru</div>

              <div className="bg-slate-100 rounded-xl py-6 px-4 mb-4">
                <div className="text-6xl font-bold text-slate-900 mb-2">
                  {queueData.full_queue_code}
                </div>
                <div className="text-2xl font-bold text-blue-600">Counter A</div>
              </div>

              <div className="text-sm text-slate-600 mb-2">
                {formatDateTime(queueData.created_at)}
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-4 mt-4">
                <p className="text-base font-medium">
                  Silakan menuju Counter A untuk melanjutkan pendaftaran
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
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

        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Printer className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Pendaftaran Pasien Baru
          </h1>

          <p className="text-xl text-slate-600 mb-8">
            Anda akan mendapatkan nomor antrian untuk <span className="font-bold text-blue-600">Counter A</span>
          </p>

          <Button
            onClick={handleGenerateQueue}
            disabled={loading}
            size="lg"
            className="text-2xl px-12 py-8 rounded-2xl"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <span>Ambil Nomor Antrian</span>
            )}
          </Button>

          <p className="text-slate-500 mt-8 text-lg">
            Setelah mendapatkan nomor, silakan menuju Counter A
          </p>
        </div>
      </div>
    </div>
  );
};
