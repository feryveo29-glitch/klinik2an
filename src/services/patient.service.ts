import { supabase } from '../lib/supabase';

export interface Patient {
  id_pasien: string;
  nik: string;
  no_rm: string;
  no_bpjs?: string | null;
  nama_lengkap: string;
  tgl_lahir: string;
  tempat_lahir?: string | null;
  jenis_kelamin: string;
  agama?: string | null;
  golongan_darah?: string | null;
  pekerjaan: string | null;
  pendidikan: string | null;
  alamat: string | null;
  status_kawin: string | null;
  no_hp: string | null;
  email?: string | null;
  nama_ibu?: string | null;
  nama_ayah?: string | null;
  nama_wali?: string | null;
  no_hp_wali?: string | null;
  created_at: string;
  total_kunjungan?: number;
}

export interface PatientDetail extends Patient {
  kunjungan: Kunjungan[];
}

export interface Kunjungan {
  id_kunjungan: string;
  tgl_kunjungan: string;
  jenis_kunjungan: string;
  jenis_pasien: string;
  unit_pelayanan: string;
  tenaga_medis_pj: string;
  diagnosis?: {
    kode_icd10: string;
    nama_diagnosis: string;
  };
  mahasiswa?: {
    full_name: string;
  };
}

export class PatientService {
  static async getAllPatients(): Promise<Patient[]> {
    const { data: patientsData, error } = await supabase
      .from('identitas_pasien')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !patientsData) {
      console.error('Error fetching patients:', error);
      return [];
    }

    const patientsWithCount = await Promise.all(
      patientsData.map(async (patient) => {
        const { count } = await supabase
          .from('kunjungan_resume')
          .select('*', { count: 'exact', head: true })
          .eq('id_pasien', patient.id_pasien);

        return {
          ...patient,
          total_kunjungan: count || 0,
        };
      })
    );

    return patientsWithCount;
  }

  static async getPatientById(id: string): Promise<PatientDetail | null> {
    const { data: patientData, error: patientError } = await supabase
      .from('identitas_pasien')
      .select('*')
      .eq('id_pasien', id)
      .maybeSingle();

    if (patientError || !patientData) {
      console.error('Error fetching patient:', patientError);
      return null;
    }

    const { data: kunjunganData, error: kunjunganError } = await supabase
      .from('kunjungan_resume')
      .select(`
        id_kunjungan,
        tgl_kunjungan,
        jenis_kunjungan,
        jenis_pasien,
        unit_pelayanan,
        tenaga_medis_pj,
        metadata_user_buat,
        users!fk_kunjungan_user_buat (
          full_name
        )
      `)
      .eq('id_pasien', id)
      .order('tgl_kunjungan', { ascending: false });

    if (kunjunganError) {
      console.error('Error fetching kunjungan:', kunjunganError);
      return { ...patientData, kunjungan: [] };
    }

    console.log('Kunjungan data:', kunjunganData);

    const kunjunganWithDiagnosis = await Promise.all(
      (kunjunganData || []).map(async (kunjungan) => {
        const { data: asesmenData } = await supabase
          .from('soap_asesmen_diagnosis')
          .select(`
            diagnosis (
              kode_icd10,
              nama_diagnosis
            )
          `)
          .eq('id_kunjungan', kunjungan.id_kunjungan)
          .maybeSingle();

        const diagnosisArray = asesmenData?.diagnosis as any[];
        const firstDiagnosis = Array.isArray(diagnosisArray)
          ? diagnosisArray[0]
          : null;

        return {
          id_kunjungan: kunjungan.id_kunjungan,
          tgl_kunjungan: kunjungan.tgl_kunjungan,
          jenis_kunjungan: kunjungan.jenis_kunjungan,
          jenis_pasien: kunjungan.jenis_pasien,
          unit_pelayanan: kunjungan.unit_pelayanan,
          tenaga_medis_pj: kunjungan.tenaga_medis_pj,
          diagnosis: firstDiagnosis
            ? {
                kode_icd10: firstDiagnosis.kode_icd10,
                nama_diagnosis: firstDiagnosis.nama_diagnosis,
              }
            : undefined,
          mahasiswa: (kunjungan as any).users
            ? { full_name: (kunjungan as any).users.full_name }
            : undefined,
        };
      })
    );

    return {
      ...patientData,
      kunjungan: kunjunganWithDiagnosis,
    };
  }

  static async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('identitas_pasien')
      .insert(patientData)
      .select()
      .single();

    if (error) {
      console.error('Error creating patient:', error);
      if (error.code === '23505') {
        throw new Error('No. RM atau NIK sudah terdaftar');
      }
      throw new Error('Gagal mendaftarkan pasien');
    }

    return data;
  }

  static async getLastMedicalRecordNumber(): Promise<string | null> {
    const { data, error } = await supabase
      .from('identitas_pasien')
      .select('no_rm')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data.no_rm;
  }

  static calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }
}
