import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { QueueService, type QueueNumber } from '../services/queue.service';
import { useToast } from '../components/ui/toast';

export const APMNewPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState<QueueNumber | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Nomor Antrian Anda
            </h1>

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

        <div className="hidden print:block" ref={printRef}>
          <div className="p-8 bg-white">
            <div className="text-center border-4 border-dashed border-slate-300 p-8">
              <img src="/logo-dewata-1.png" alt="Logo" className="h-16 mx-auto mb-4" />
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
      </div>
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
