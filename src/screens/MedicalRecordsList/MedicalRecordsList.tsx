import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { supabase } from '../../lib/supabase';
import type { KunjunganWithRelations, User } from '../../types/database.types';

export const MedicalRecordsList: React.FC = () => {
  const [records, setRecords] = useState<KunjunganWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMedicalRecords();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setCurrentUser(data);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const { data: kunjunganData, error } = await supabase
        .from('kunjungan_resume')
        .select(`
          *,
          pasien:identitas_pasien!inner(id_pasien, no_rm, nama_lengkap),
          asesmen:soap_asesmen_diagnosis!left(
            id_asesmen,
            diagnoses:diagnosis!left(kode_icd10, nama_diagnosis)
          )
        `)
        .order('tgl_kunjungan', { ascending: false });

      if (error) throw error;

      const recordsWithUploader = await Promise.all(
        (kunjunganData || []).map(async (record) => {
          let uploaderName = 'Unknown';

          if (record.metadata_user_buat) {
            const { data: userData } = await supabase
              .from('users')
              .select('full_name, role')
              .eq('id', record.metadata_user_buat)
              .maybeSingle();

            if (userData) {
              uploaderName = userData.full_name;
            }
          }

          return {
            ...record,
            uploader_name: uploaderName
          };
        })
      );

      setRecords(recordsWithUploader as KunjunganWithRelations[]);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.pasien?.no_rm?.toLowerCase().includes(searchLower) ||
      record.pasien?.nama_lengkap?.toLowerCase().includes(searchLower) ||
      record.unit_pelayanan?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderUploaderInfo = (uploaderName?: string) => {
    if (currentUser?.role === 'mahasiswa') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          Anonymous
        </span>
      );
    }

    if (currentUser?.role === 'dosen' || currentUser?.role === 'admin') {
      return (
        <span className="text-sm text-slate-700">{uploaderName || 'Unknown'}</span>
      );
    }

    return <span className="text-sm text-slate-500">-</span>;
  };

  const getPrimaryDiagnosis = (record: KunjunganWithRelations) => {
    const diagnosis = record.asesmen?.diagnoses?.[0];
    if (diagnosis) {
      return `${diagnosis.kode_icd10} - ${diagnosis.nama_diagnosis}`;
    }
    return '-';
  };

  if (loading) {
    return (
      <PageWrapper>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">Memuat data...</p>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-3xl font-bold">Daftar Rekam Medis</CardTitle>
            <Button
              onClick={() => window.location.href = '/create-medical-record'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Buat Rekam Medis Baru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <img
                src="/iconsax-linear-searchnormal1.svg"
                alt="Search"
                className="w-5 h-5 text-slate-400"
              />
              <Input
                type="text"
                placeholder="Cari berdasarkan No. RM, Nama Pasien, atau Unit Layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">
                    Tanggal Kunjungan
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">
                    No. RM & Nama Pasien
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">
                    Unit Layanan
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">
                    Diagnosis Utama
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">
                    Diinput Oleh
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-slate-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data rekam medis'}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id_kunjungan}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {formatDate(record.tgl_kunjungan)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {record.pasien?.nama_lengkap || '-'}
                          </span>
                          <span className="text-xs text-slate-500">
                            RM: {record.pasien?.no_rm || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {record.unit_pelayanan}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {getPrimaryDiagnosis(record)}
                      </td>
                      <td className="py-3 px-4">
                        {renderUploaderInfo(record.uploader_name)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('View detail:', record.id_kunjungan)}
                          >
                            Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('Print:', record.id_kunjungan)}
                          >
                            Cetak
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredRecords.length > 0 && (
            <div className="mt-4 text-sm text-slate-600">
              Menampilkan {filteredRecords.length} dari {records.length} rekam medis
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
