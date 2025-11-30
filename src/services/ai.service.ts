import { DummyDataService } from './dummy-data.service';

// Service ini sekarang menggunakan Dummy Data Generator lokal
// untuk menghindari masalah API Key dan limitasi model.
export const aiService = {
    // Selalu available karena pakai data lokal
    isAvailable: () => true,

    // Fungsi debug tidak diperlukan lagi
    async debugModels() {
        alert("Menggunakan Local Dummy Data Generator (Offline Mode)");
    },

    async generatePatientData() {
        // Simulasi delay biar terasa seperti "mikir"
        await new Promise(resolve => setTimeout(resolve, 800));
        return DummyDataService.generatePatientData();
    },

    async generateMedicalRecord(patientInfo: { nama: string, umur: number, gender: string }) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Menggunakan generator skenario kasus nyata
        const record = DummyDataService.generateCoherentMedicalRecord();

        return {
            keluhan_utama: record.keluhan_utama,
            anamnesis: {
                rps: record.anamnesis.rps,
                rpd: record.anamnesis.rpd,
                riwayat_obat: record.anamnesis.riwayat_obat,
                alergi: record.anamnesis.alergi
            },
            pemeriksaan_fisik: {
                td_sistol: record.pemeriksaan_fisik.td_sistol,
                td_diastol: record.pemeriksaan_fisik.td_diastol,
                nadi: record.pemeriksaan_fisik.nadi,
                suhu: record.pemeriksaan_fisik.suhu,
                rr: record.pemeriksaan_fisik.rr,
                bb: record.pemeriksaan_fisik.bb,
                tb: record.pemeriksaan_fisik.tb,
                catatan: record.pemeriksaan_fisik.catatan
            },
            diagnosis: {
                kode_icd10: record.diagnosis.kode_icd10,
                nama_diagnosis: record.diagnosis.nama_diagnosis
            },
            terapi: record.terapi
        };
    }
};
