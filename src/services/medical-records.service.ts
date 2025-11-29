import { supabase } from '../lib/supabase';
import type { KunjunganWithRelations } from '../types/database.types';
export type { KunjunganWithRelations };

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
  async createMedicalRecord(input: CreateMedicalRecordInput): Promise<{ kunjunganId: string }> {
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
    const userId = input.kunjungan.metadata_user_buat; // Get userId for all SOAP inserts

    if (input.subjektif && (input.subjektif.keluhan_utama || input.subjektif.rps)) {
      const { error: subjektifError } = await supabase.from('soap_subjektif').insert({
        id_kunjungan: kunjunganId,
        keluhan_utama: input.subjektif.keluhan_utama || '',
        rps: input.subjektif.rps || '',
        rpd: input.subjektif.rpd || '',
        riwayat_obat: input.subjektif.riwayat_obat || '',
        riwayat_alergi: input.subjektif.riwayat_alergi || '',
        metadata_user_buat: userId,
      });

      if (subjektifError) {
        console.error('[ERROR] Insert soap_subjektif failed:', subjektifError);
        throw new Error(`Gagal menyimpan data subjektif: ${subjektifError.message}`);
      } else {
        console.log('[SUCCESS] soap_subjektif inserted');
      }
    }

    if (input.objektif) {
      // Combine sistol/diastol into tv_td format
      const tv_td = input.objektif.td_sistol && input.objektif.td_diastol
        ? `${input.objektif.td_sistol}/${input.objektif.td_diastol}`
        : null;

      const { error: objektifError } = await supabase.from('soap_objektif').insert({
        id_kunjungan: kunjunganId,
        keadaan_umum: null, // Optional, not in input
        tv_td: tv_td,
        tv_nadi: input.objektif.nadi || null,
        tv_rr: input.objektif.respiratory_rate || null,
        tv_suhu: input.objektif.suhu || null,
        tb: input.objektif.tinggi_badan || null,
        bb: input.objektif.berat_badan || null,
        fisik_naratif: input.objektif.pemeriksaan_fisik || '',
        metadata_user_buat: userId,
      });

      if (objektifError) {
        console.error('[ERROR] Insert soap_objektif failed:', objektifError);
        throw new Error(`Gagal menyimpan data objektif: ${objektifError.message}`);
      } else {
        console.log('[SUCCESS] soap_objektif inserted');
      }
    }

    // Note: pemeriksaan_penunjang requires jenis and nama_pemeriksaan (NOT NULL)
    // Skip if input doesn't have these required fields
    if (input.penunjang && input.penunjang.hasil_file) {
      const { error: penunjangError } = await supabase.from('pemeriksaan_penunjang').insert({
        id_kunjungan: kunjunganId,
        jenis: 'Lainnya', // Default type
        nama_pemeriksaan: 'Pemeriksaan Penunjang', // Default name
        hasil: input.penunjang.hasil_file || '',
        satuan: null,
        id_file_lampiran: null,
        metadata_user_buat: userId,
      });

      if (penunjangError) {
        console.error('[ERROR] Insert pemeriksaan_penunjang failed:', penunjangError);
        throw new Error(`Gagal menyimpan data penunjang: ${penunjangError.message}`);
      } else {
        console.log('[SUCCESS] pemeriksaan_penunjang inserted');
      }
    }

    // Insert diagnosis (head-detail pattern)
    if (input.diagnosis && (input.diagnosis.kode_icd10 || input.diagnosis.nama_diagnosis)) {
      // First insert to soap_asesmen_diagnosis (head)
      const { data: asesmenData, error: asesmenError } = await supabase
        .from('soap_asesmen_diagnosis')
        .insert({
          id_kunjungan: kunjunganId,
          catatan_klinis: '', // Optional clinical notes
          metadata_user_buat: userId,
        })
        .select()
        .single();

      if (asesmenError) {
        console.error('Error inserting asesmen:', asesmenError);
        throw asesmenError;
      }

      // Then insert to diagnosis table (detail)
      if (asesmenData) {
        const { error: diagnosisError } = await supabase
          .from('diagnosis')
          .insert({
            id_asesmen: asesmenData.id_asesmen,
            jenis_diagnosis: 'primer', // Default to primary diagnosis
            kode_icd10: input.diagnosis.kode_icd10 || '',
            nama_diagnosis: input.diagnosis.nama_diagnosis || '',
            metadata_user_buat: userId,
          });

        if (diagnosisError) {
          console.error('Error inserting diagnosis:', diagnosisError);
          throw diagnosisError;
        }
      }
    }

    if (input.plan && input.plan.rencana_terapi) {
      const { error: planError } = await supabase.from('soap_plan').insert({
        id_kunjungan: kunjunganId,
        rencana_umum: input.plan.rencana_terapi,
        rencana_kontrol: null,
        metadata_user_buat: userId,
      });

      if (planError) {
        console.error('[ERROR] Insert soap_plan failed:', planError);
        throw new Error(`Gagal menyimpan data plan: ${planError.message}`);
      } else {
        console.log('[SUCCESS] soap_plan inserted');
      }
    }

    return { kunjunganId };
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
