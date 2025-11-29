import { supabase } from '../lib/supabase';

export interface Student {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
  total_input: number;
  last_activity?: string;
}

export interface StudentDetail extends Student {
  kunjungan: StudentKunjungan[];
}

export interface StudentKunjungan {
  id_kunjungan: string;
  tgl_kunjungan: string;
  pasien: {
    no_rm: string;
    nama_lengkap: string;
  };
  jenis_kunjungan: string;
  unit_pelayanan: string;
  diagnosis?: {
    kode_icd10: string;
    nama_diagnosis: string;
  };
}

export class StudentService {
  static async getAllStudents(): Promise<Student[]> {
    const { data: studentsData, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'mahasiswa')
      .order('full_name', { ascending: true });

    if (error || !studentsData) {
      console.error('Error fetching students:', error);
      return [];
    }

    const studentsWithStats = await Promise.all(
      studentsData.map(async (student) => {
        const { count } = await supabase
          .from('kunjungan_resume')
          .select('*', { count: 'exact', head: true })
          .eq('metadata_user_buat', student.id);

        const { data: lastActivity } = await supabase
          .from('kunjungan_resume')
          .select('tgl_kunjungan')
          .eq('metadata_user_buat', student.id)
          .order('tgl_kunjungan', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          id: student.id,
          username: student.username,
          full_name: student.full_name,
          created_at: student.created_at,
          total_input: count || 0,
          last_activity: lastActivity?.tgl_kunjungan,
        };
      })
    );

    return studentsWithStats;
  }

  static async getStudentById(id: string): Promise<StudentDetail | null> {
    const { data: studentData, error: studentError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('role', 'mahasiswa')
      .maybeSingle();

    if (studentError || !studentData) {
      console.error('Error fetching student:', studentError);
      return null;
    }

    const { data: kunjunganData, error: kunjunganError } = await supabase
      .from('kunjungan_resume')
      .select(`
        id_kunjungan,
        tgl_kunjungan,
        jenis_kunjungan,
        unit_pelayanan,
        identitas_pasien!kunjungan_resume_id_pasien_fkey (
          no_rm,
          nama_lengkap
        )
      `)
      .eq('metadata_user_buat', id)
      .order('tgl_kunjungan', { ascending: false });

    if (kunjunganError) {
      console.error('Error fetching kunjungan:', kunjunganError);
    }

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
          pasien: {
            no_rm: (kunjungan.identitas_pasien as any)?.no_rm || '',
            nama_lengkap:
              (kunjungan.identitas_pasien as any)?.nama_lengkap || '',
          },
          jenis_kunjungan: kunjungan.jenis_kunjungan,
          unit_pelayanan: kunjungan.unit_pelayanan,
          diagnosis: firstDiagnosis
            ? {
                kode_icd10: firstDiagnosis.kode_icd10,
                nama_diagnosis: firstDiagnosis.nama_diagnosis,
              }
            : undefined,
        };
      })
    );

    const { count: totalInput } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true })
      .eq('metadata_user_buat', id);

    const { data: lastActivityData } = await supabase
      .from('kunjungan_resume')
      .select('tgl_kunjungan')
      .eq('metadata_user_buat', id)
      .order('tgl_kunjungan', { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      id: studentData.id,
      username: studentData.username,
      full_name: studentData.full_name,
      created_at: studentData.created_at,
      total_input: totalInput || 0,
      last_activity: lastActivityData?.tgl_kunjungan,
      kunjungan: kunjunganWithDiagnosis,
    };
  }
}
