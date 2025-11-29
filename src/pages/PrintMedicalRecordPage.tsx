import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { ArrowLeft, Printer, Search } from 'lucide-react';
import { PatientService, type Patient, type PatientDetail } from '../services/patient.service';
import { medicalRecordsService, type KunjunganWithRelations } from '../services/medical-records.service';
import type { User } from '../types/auth.types';
import { MedicalRecordPrintTemplate } from '../components/print/MedicalRecordPrintTemplate';

type Step = 'select-patient' | 'select-visit' | 'preview-resume';

export const PrintMedicalRecordPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    const [step, setStep] = useState<Step>('select-patient');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
    const [selectedVisit, setSelectedVisit] = useState<KunjunganWithRelations | null>(null);
    const [loading, setLoading] = useState(false);

    // Load user from localStorage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userStr));
    }, [navigate]);

    // Load all patients on mount
    useEffect(() => {
        if (user) {
            loadPatients();
        }
    }, [user]);

    // Filter patients when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = patients.filter(
                (p) =>
                    p.no_rm.toLowerCase().includes(query) ||
                    p.nama_lengkap.toLowerCase().includes(query) ||
                    p.nik?.toLowerCase().includes(query)
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
            console.error('Error loading patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPatient = async (patient: Patient) => {
        setLoading(true);
        try {
            const patientDetail = await PatientService.getPatientById(patient.id_pasien);
            if (patientDetail) {
                setSelectedPatient(patientDetail);
                setStep('select-visit');
            }
        } catch (error) {
            console.error('Error loading patient detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVisit = async (kunjungan: any) => {
        setLoading(true);
        try {
            console.log('[DEBUG] Fetching visit detail for:', kunjungan.id_kunjungan);
            const visitDetail = await medicalRecordsService.getRecordById(kunjungan.id_kunjungan);
            console.log('[DEBUG] Visit detail received:', visitDetail);

            if (visitDetail) {
                console.log('[DEBUG] Setting selectedVisit and moving to preview');
                setSelectedVisit(visitDetail);
                setStep('preview-resume');
            } else {
                console.error('[ERROR] Visit detail is null');
            }
        } catch (error) {
            console.error('Error loading visit detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        if (step === 'select-visit') {
            setStep('select-patient');
            setSelectedPatient(null);
        } else if (step === 'preview-resume') {
            setStep('select-visit');
            setSelectedVisit(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <MainLayout user={user} onLogout={logout}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Cetak Resume Medis</h1>
                        <p className="text-slate-600 mt-1">
                            {step === 'select-patient' && 'Pilih pasien untuk melihat riwayat kunjungan'}
                            {step === 'select-visit' && 'Pilih kunjungan untuk mencetak resume medis'}
                            {step === 'preview-resume' && 'Preview resume medis'}
                        </p>
                    </div>
                    {step !== 'select-patient' && (
                        <Button variant="outline" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    )}
                </div>

                {/* Step 1: Select Patient */}
                {step === 'select-patient' && (
                    <Card className="p-6">
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Cari pasien (No. RM, Nama, NIK)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Patient List */}
                            {loading ? (
                                <div className="text-center py-8 text-slate-500">Loading...</div>
                            ) : filteredPatients.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    {searchQuery ? 'Tidak ada pasien yang ditemukan' : 'Belum ada data pasien'}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">No. RM</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Nama Lengkap</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Tanggal Lahir</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Total Kunjungan</th>
                                                <th className="text-center py-3 px-4 font-semibold text-slate-700">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPatients.map((patient) => (
                                                <tr key={patient.id_pasien} className="border-b hover:bg-slate-50">
                                                    <td className="py-3 px-4">{patient.no_rm}</td>
                                                    <td className="py-3 px-4">{patient.nama_lengkap}</td>
                                                    <td className="py-3 px-4">
                                                        {new Date(patient.tgl_lahir).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="py-3 px-4">{patient.total_kunjungan || 0}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSelectPatient(patient)}
                                                            disabled={!patient.total_kunjungan || patient.total_kunjungan === 0}
                                                        >
                                                            Pilih
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Step 2: Select Visit */}
                {step === 'select-visit' && selectedPatient && (
                    <div className="space-y-4">
                        {/* Patient Info */}
                        <Card className="p-4 bg-blue-50 border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Pasien Terpilih</p>
                                    <p className="font-semibold text-slate-900">
                                        {selectedPatient.nama_lengkap} ({selectedPatient.no_rm})
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Visit List */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Riwayat Kunjungan</h3>
                            {loading ? (
                                <div className="text-center py-8 text-slate-500">Loading...</div>
                            ) : selectedPatient.kunjungan.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">Belum ada riwayat kunjungan</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Tanggal</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Jenis Kunjungan</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Unit Pelayanan</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Diagnosis</th>
                                                <th className="text-center py-3 px-4 font-semibold text-slate-700">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPatient.kunjungan.map((kunjungan) => (
                                                <tr key={kunjungan.id_kunjungan} className="border-b hover:bg-slate-50">
                                                    <td className="py-3 px-4">
                                                        {new Date(kunjungan.tgl_kunjungan).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td className="py-3 px-4">{kunjungan.jenis_kunjungan}</td>
                                                    <td className="py-3 px-4">{kunjungan.unit_pelayanan}</td>
                                                    <td className="py-3 px-4">
                                                        {kunjungan.diagnosis
                                                            ? `${kunjungan.diagnosis.kode_icd10}: ${kunjungan.diagnosis.nama_diagnosis}`
                                                            : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <Button size="sm" onClick={() => handleSelectVisit(kunjungan)}>
                                                            Lihat Resume
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* Step 3: Preview Resume */}
                {step === 'preview-resume' && selectedVisit && selectedPatient && (
                    <div className="space-y-4">
                        {/* Print Button */}
                        <div className="flex justify-end no-print">
                            <Button onClick={handlePrint} className="gap-2">
                                <Printer className="w-4 h-4" />
                                Print Resume
                            </Button>
                        </div>

                        {/* Resume Content - Use Template */}
                        <div className="bg-white">
                            <MedicalRecordPrintTemplate
                                patient={selectedPatient}
                                visit={selectedVisit}
                            />
                        </div>
                    </div>
                )}
            </div>
        </MainLayout >
    );
};
