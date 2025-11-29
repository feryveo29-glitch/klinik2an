import React from 'react';
import type { PatientDetail } from '../../services/patient.service';
import type { KunjunganWithRelations } from '../../services/medical-records.service';

interface MedicalRecordPrintTemplateProps {
    patient: PatientDetail;
    visit: KunjunganWithRelations;
}

export const MedicalRecordPrintTemplate: React.FC<MedicalRecordPrintTemplateProps> = ({
    patient,
    visit,
}) => {
    // Helper functions
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getRMNumber = () => {
        // Extract last 2 digits from RM number
        const rmMatch = patient.no_rm.match(/\d+$/);
        return rmMatch ? rmMatch[0].slice(-2) : '00';
    };

    const subjektif = Array.isArray(visit.subjektif) && visit.subjektif.length > 0 ? visit.subjektif[0] : null;
    const objektif = Array.isArray(visit.objektif) && visit.objektif.length > 0 ? visit.objektif[0] : null;
    const asesmen = Array.isArray(visit.asesmen) && visit.asesmen.length > 0 ? visit.asesmen[0] : null;
    const plan = Array.isArray(visit.plan) && visit.plan.length > 0 ? visit.plan[0] : null;
    const diagnoses = (asesmen as any)?.diagnoses || [];

    return (
        <div className="print-template" style={{ width: '100%', fontFamily: 'Arial, sans-serif', fontSize: '10pt' }}>
            {/* Header */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '15%', border: '1px solid #000', padding: '8pt', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14pt !important' }}>DOMPET<br />DHUAFA</div>
                            <div style={{ fontSize: '8pt !important', marginTop: '4pt' }}>RUMAH SAKIT</div>
                        </td>
                        <td style={{ width: '60%', border: '1px solid #000', padding: '4pt' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '50%', padding: '2pt', borderRight: '1px solid #000' }}>
                                            <div><strong>Tanggal Masuk</strong>: {formatDate(visit.tgl_kunjungan)}</div>
                                            <div><strong>Tanggal Keluar</strong>: {formatDate(visit.tgl_kunjungan)}</div>
                                            <div><strong>Ruang Rawat Terakhir</strong>: {visit.unit_pelayanan}</div>
                                        </td>
                                        <td style={{ width: '50%', padding: '2pt' }}>
                                            <div><strong>Identitas</strong>: {patient.nik || '-'}</div>
                                            <div><strong>Nama</strong>: {patient.nama_lengkap}</div>
                                            <div><strong>Nomor RM</strong>: {patient.no_rm}</div>
                                            <div><strong>Jaminan</strong>: {visit.jenis_pasien}</div>
                                            <div><strong>Tgl lahir</strong>: {formatDate(patient.tgl_lahir)}</div>
                                            <div><strong>Jenis kelamin</strong>: {patient.jenis_kelamin}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ borderTop: '1px solid #000', padding: '4pt', marginTop: '4pt' }}>
                                <strong>Alergi obat:</strong> {subjektif?.riwayat_alergi || '-'}
                            </div>
                        </td>
                        <td style={{ width: '25%', border: '1px solid #000', padding: '8pt', textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '16pt !important', fontWeight: 'bold' }}>RM</div>
                            <div style={{ fontSize: '36pt !important', fontWeight: 'bold', marginTop: '8pt' }}>{getRMNumber()}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Anamnesis & Hasil Pemeriksaan */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '60%', border: '1px solid #000', padding: '4pt', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>
                                Anamnesis (terkait alasan masuk rumah sakit dan keluhan yang penting)
                            </div>
                            <div style={{ minHeight: '80pt' }}>
                                <div><strong>Keluhan Utama:</strong> {subjektif?.keluhan_utama || '-'}</div>
                                <div style={{ marginTop: '4pt' }}><strong>RPS:</strong> {subjektif?.rps || '-'}</div>
                                <div style={{ marginTop: '4pt' }}><strong>RPD:</strong> {subjektif?.rpd || '-'}</div>
                            </div>
                        </td>
                        <td style={{ width: '40%', border: '1px solid #000', padding: '4pt', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>
                                Hasil pemeriksaan diagnosis dan data penting lainnya
                            </div>
                            <div style={{ minHeight: '80pt' }}>
                                {diagnoses.length > 0 ? (
                                    diagnoses.map((diag: any, idx: number) => (
                                        <div key={idx} style={{ marginBottom: '4pt' }}>
                                            • {diag.kode_icd10}: {diag.nama_diagnosis}
                                        </div>
                                    ))
                                ) : (
                                    <div>-</div>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Pemeriksaan Fisik */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>Pemeriksaan fisik</div>
                            <div style={{ minHeight: '60pt' }}>
                                {objektif && (
                                    <>
                                        <div>
                                            <strong>Tanda Vital:</strong> TD: {objektif.tv_td || '-'}, Nadi: {objektif.tv_nadi || '-'} x/mnt,
                                            RR: {objektif.tv_rr || '-'} x/mnt, Suhu: {objektif.tv_suhu || '-'}°C,
                                            TB: {objektif.tb || '-'} cm, BB: {objektif.bb || '-'} kg
                                        </div>
                                        <div style={{ marginTop: '4pt' }}>
                                            <strong>Pemeriksaan Fisik:</strong> {objektif.fisik_naratif || '-'}
                                        </div>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Terapi */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>Terapi</div>
                            <div style={{ minHeight: '60pt' }}>
                                {(plan as any)?.rencana_umum || '-'}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Diagnosis */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '70%', border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            Diagnosis Utama
                        </td>
                        <td style={{ width: '30%', border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            ICD
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt', minHeight: '20pt' }}>
                            {diagnoses[0]?.nama_diagnosis || '-'}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '4pt' }}>
                            {diagnoses[0]?.kode_icd10 || '-'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            Diagnosis Sekunder
                        </td>
                        <td style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            ICD
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt', minHeight: '20pt' }}>
                            {diagnoses[1]?.nama_diagnosis || '-'}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '4pt' }}>
                            {diagnoses[1]?.kode_icd10 || '-'}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Tindakan */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>Tindakan</div>
                            <div style={{ minHeight: '40pt' }}>
                                {(plan as any)?.tindakan_medis || '-'}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Kondisi Pulang & Pengobatan */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '50%', border: '1px solid #000', padding: '4pt' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>Kondisi saat pulang (pilih salah satu)</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4pt' }}>
                                <div>☐ Sembuh</div>
                                <div>☐ Pulang APS</div>
                                <div>☐ Perbaikan</div>
                                <div>☐ Meninggal Dunia</div>
                                <div>☐ Rujuk Ke RS Lain</div>
                                <div>☐ Lainnya</div>
                            </div>
                        </td>
                        <td style={{ width: '50%', border: '1px solid #000', padding: '4pt' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4pt' }}>Pengobatan dilanjutkan di...</div>
                            <div>
                                <div>☐ Kontrol Poli Klinik....... ☐ lainnya ...........</div>
                                <div style={{ marginTop: '8pt' }}>☐ Tanggal ...................</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Obat Pulang */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
                <tbody>
                    <tr>
                        <td colSpan={4} style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            Obat Pulang
                        </td>
                        <td colSpan={2} style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            DPJP (Nama&Ttd)
                        </td>
                        <td colSpan={2} style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            Saksi/Kel Px (Nama&Ttd)
                        </td>
                        <td colSpan={2} style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold' }}>
                            Pasien (Nama&Ttd)
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold', width: '20%' }}>Nama obat</td>
                        <td style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold', width: '15%' }}>Dosis (...x...)</td>
                        <td style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold', width: '10%' }}>Jumlah</td>
                        <td style={{ border: '1px solid #000', padding: '4pt', fontWeight: 'bold', width: '15%' }}>Ket.lain</td>
                        <td rowSpan={4} style={{ border: '1px solid #000', padding: '4pt', minHeight: '80pt', verticalAlign: 'bottom' }}>
                            <div style={{ marginTop: '60pt' }}>Dibuat Pada</div>
                            <div>Tanggal.........</div>
                        </td>
                        <td rowSpan={4} style={{ border: '1px solid #000', padding: '4pt', minHeight: '80pt', verticalAlign: 'bottom' }}>
                            <div>{visit.uploader_name || '-'}</div>
                        </td>
                        <td rowSpan={4} style={{ border: '1px solid #000', padding: '4pt', minHeight: '80pt', verticalAlign: 'bottom' }}>
                            <div style={{ marginTop: '60pt' }}>Dibuat Pada</div>
                            <div>Tanggal.........</div>
                        </td>
                        <td rowSpan={4} style={{ border: '1px solid #000', padding: '4pt', minHeight: '80pt' }}></td>
                        <td rowSpan={4} style={{ border: '1px solid #000', padding: '4pt', minHeight: '80pt', verticalAlign: 'bottom' }}>
                            <div style={{ marginTop: '60pt' }}>Dibuat Pada</div>
                            <div>Tanggal.........</div>
                        </td>
                        <td rowSpan={4} style={{ border: '1px solid #000', padding: '4pt', minHeight: '80pt' }}></td>
                    </tr>
                    {[0, 1, 2].map((idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #000', padding: '4pt', minHeight: '20pt' }}></td>
                            <td style={{ border: '1px solid #000', padding: '4pt' }}></td>
                            <td style={{ border: '1px solid #000', padding: '4pt' }}></td>
                            <td style={{ border: '1px solid #000', padding: '4pt' }}></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div style={{ fontSize: '8pt', marginTop: '8pt' }}>
                Dibuat 3 rangkap : 1. Rekam medis  2. Penjamin  3. Pasien
                <span style={{ float: 'right' }}>0001/Rev.02/RI/2018</span>
            </div>
        </div>
    );
};
