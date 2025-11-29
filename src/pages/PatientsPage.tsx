import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Eye, Loader2, Users as UsersIcon } from 'lucide-react';
import { PatientService, type Patient } from '../services/patient.service';

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = patients.filter(
        (patient) =>
          patient.nama_lengkap.toLowerCase().includes(query) ||
          patient.no_rm.toLowerCase().includes(query) ||
          patient.nik.toLowerCase().includes(query)
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    return PatientService.calculateAge(birthDate);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Data Pasien</h1>
        <p className="text-slate-600 mt-1">
          Daftar semua pasien dan rekam medis mereka
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Daftar Pasien ({filteredPatients.length})
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama, NIK, atau No. RM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      No. RM
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Nama Lengkap
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      NIK
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Umur
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">
                      Jenis Kelamin
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-slate-700">
                      Total Kunjungan
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id_pasien}
                      className="border-t hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 text-sm font-medium text-blue-600">
                        {patient.no_rm}
                      </td>
                      <td className="p-3 text-sm text-slate-900">
                        {patient.nama_lengkap}
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {patient.nik}
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {calculateAge(patient.tgl_lahir)} tahun
                      </td>
                      <td className="p-3 text-sm text-slate-600">
                        {patient.jenis_kelamin === 'L'
                          ? 'Laki-laki'
                          : 'Perempuan'}
                      </td>
                      <td className="p-3 text-sm text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                          {patient.total_kunjungan || 0}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/patients/${patient.id_pasien}`)
                          }
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <UsersIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">
                {searchQuery ? 'Pasien tidak ditemukan' : 'Belum ada data pasien'}
              </p>
              <p className="text-sm mt-1">
                {searchQuery
                  ? 'Coba kata kunci pencarian lain'
                  : 'Data pasien akan muncul setelah ada input rekam medis'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </PageWrapper>
  );
};
