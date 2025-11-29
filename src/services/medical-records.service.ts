import { supabase } from '../lib/supabase';
import type { KunjunganWithRelations } from '../types/database.types';

interface CreateMedicalRecordInput {
  patientId: string;
  kunjungan: {
    tgl_kunjungan: string;
    jenis_kunjungan: string;
    jenis_pasien: string;
    unit_pelayanan: string;
    tenaga_medis_pj: string;
    metadata_user_buat?: string;
  };
  subjektif?: {
    keluhan_utama?: string;
    rps?: string;
    rpd?: string;
    riwayat_obat?: string;
    riwayat_alergi?: string;
  };
  objektif?: {
    td_sistol?: number | null;
    td_diastol?: number | null;
    nadi?: number | null;
    respiratory_rate?: number | null;
    suhu?: number | null;
    tinggi_badan?: number | null;
    berat_badan?: number | null;
    pemeriksaan_fisik?: string;
  };
  penunjang?: {
    hasil_file?: string;
    catatan_klinis?: string;
  };
  diagnosis?: {
    kode_icd10?: string;
    nama_diagnosis?: string;
  };
  plan?: {
    rencana_terapi?: string;
  };
}

export const MedicalRecordsService = {
  async createMedicalRecord(input: CreateMedicalRecordInput): Promise<string> {
    const { data: kunjunganData, error: kunjunganError } = await supabase
      .from('kunjungan_resume')
      .insert({
        id_pasien: input.patientId,
        tgl_kunjungan: input.kunjungan.tgl_kunjungan,
        jenis_kunjungan: input.kunjungan.jenis_kunjungan,
        jenis_pasien: input.kunjungan.jenis_pasien,
        unit_pelayanan: input.kunjungan.unit_pelayanan,
        tenaga_medis_pj: input.kunjungan.tenaga_medis_pj,
        metadata_user_buat: input.kunjungan.metadata_user_buat,
      })
      .select()
      .single();

    if (kunjunganError || !kunjunganData) {
      console.error('Error creating kunjungan:', kunjunganError);
      throw new Error('Gagal membuat data kunjungan');
    }

    const kunjunganId = kunjunganData.id_kunjungan;

    if (input.subjektif && (input.subjektif.keluhan_utama || input.subjektif.rps)) {
      await supabase.from('soap_subjektif').insert({
        id_kunjungan: kunjunganId,
        keluhan_utama: input.subjektif.keluhan_utama || '',
        rps: input.subjektif.rps || '',
        rpd: input.subjektif.rpd || '',
        riwayat_obat: input.subjektif.riwayat_obat || '',
        riwayat_alergi: input.subjektif.riwayat_alergi || '',
      });
    }

    if (input.objektif) {
      await supabase.from('soap_objektif').insert({
        id_kunjungan: kunjunganId,
        td_sistol: input.objektif.td_sistol,
        td_diastol: input.objektif.td_diastol,
        nadi: input.objektif.nadi,
        respiratory_rate: input.objektif.respiratory_rate,
        suhu: input.objektif.suhu,
        tinggi_badan: input.objektif.tinggi_badan,
        berat_badan: input.objektif.berat_badan,
        pemeriksaan_fisik: input.objektif.pemeriksaan_fisik || '',
      });
    }

    if (input.penunjang && (input.penunjang.hasil_file || input.penunjang.catatan_klinis)) {
      await supabase.from('pemeriksaan_penunjang').insert({
        id_kunjungan: kunjunganId,
        hasil_file: input.penunjang.hasil_file || '',
        catatan_klinis: input.penunjang.catatan_klinis || '',
      });
    }

    if (input.diagnosis && (input.diagnosis.kode_icd10 || input.diagnosis.nama_diagnosis)) {
      await supabase.from('soap_asesmen_diagnosis').insert({
        id_kunjungan: kunjunganId,
        diagnosis: [
          {
            kode_icd10: input.diagnosis.kode_icd10 || '',
            nama_diagnosis: input.diagnosis.nama_diagnosis || '',
          },
        ],
      });
    }

    if (input.plan && input.plan.rencana_terapi) {
      await supabase.from('soap_plan').insert({
        id_kunjungan: kunjunganId,
        rencana_terapi: input.plan.rencana_terapi,
        tindakan_medis: [],
        terapi_obat: [],
      });
    }

    return kunjunganId;
  },
};

export const medicalRecordsService = {
  async getAllRecords(): Promise<KunjunganWithRelations[]> {
    const { data, error } = await supabase
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

    if (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }

    const recordsWithUploader = await Promise.all(
      (data || []).map(async (record) => {
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

    return recordsWithUploader as KunjunganWithRelations[];
  },

  async getRecordById(id: string): Promise<KunjunganWithRelations | null> {
    const { data, error } = await supabase
      .from('kunjungan_resume')
      .select(`
        *,
        pasien:identitas_pasien!inner(*),
        subjektif:soap_subjektif!left(*),
        objektif:soap_objektif!left(*),
        pemeriksaan_penunjang:pemeriksaan_penunjang!left(*),
        asesmen:soap_asesmen_diagnosis!left(
          *,
          diagnoses:diagnosis!left(*)
        ),
        plan:soap_plan!left(
          *,
          tindakan_medis:tindakan_medis!left(*),
          terapi_obat:terapi_obat!left(*)
        )
      `)
      .eq('id_kunjungan', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching medical record:', error);
      throw error;
    }

    if (!data) return null;

    let uploaderName = 'Unknown';
    if (data.metadata_user_buat) {
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', data.metadata_user_buat)
        .maybeSingle();

      if (userData) {
        uploaderName = userData.full_name;
      }
    }

    return {
      ...data,
      uploader_name: uploaderName
    } as KunjunganWithRelations;
  }
};
