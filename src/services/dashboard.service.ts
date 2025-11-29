import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalMahasiswa?: number;
  totalInput?: number;
  perluReview?: number;
  totalUsers?: number;
  totalRekamMedis?: number;
  activeToday?: number;
  storageUsed?: string;
  totalPasien?: number;
  pasienHariIni?: number;
  totalPegawai?: number;
}

export interface MahasiswaRecord {
  id_kunjungan: string;
  tgl_kunjungan: string;
  pasien: {
    no_rm: string;
    nama_lengkap: string;
  };
  diagnosis?: string;
  kode_icd10?: string;
}

export interface DosenReviewItem {
  id_kunjungan: string;
  mahasiswa_name: string;
  tgl_kunjungan: string;
  status: string;
}

export class DashboardService {
  static async getMahasiswaStats(userId: string): Promise<DashboardStats> {
    const { count } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true })
      .eq('metadata_user_buat', userId);

    return {
      totalInput: count || 0,
    };
  }

  static async getMahasiswaRecords(userId: string): Promise<MahasiswaRecord[]> {
    const { data: kunjunganData, error } = await supabase
      .from('kunjungan_resume')
      .select(`
        id_kunjungan,
        tgl_kunjungan,
        identitas_pasien!kunjungan_resume_id_pasien_fkey (
          no_rm,
          nama_lengkap
        )
      `)
      .eq('metadata_user_buat', userId)
      .order('tgl_kunjungan', { ascending: false })
      .limit(5);

    if (error || !kunjunganData) {
      return [];
    }

    const recordsWithDiagnosis = await Promise.all(
      kunjunganData.map(async (record) => {
        const { data: asesmenData } = await supabase
          .from('soap_asesmen_diagnosis')
          .select(`
            diagnosis (
              kode_icd10,
              nama_diagnosis
            )
          `)
          .eq('id_kunjungan', record.id_kunjungan)
          .maybeSingle();

        const diagnosisArray = asesmenData?.diagnosis as any[];
        const firstDiagnosis = Array.isArray(diagnosisArray) ? diagnosisArray[0] : null;

        return {
          id_kunjungan: record.id_kunjungan,
          tgl_kunjungan: record.tgl_kunjungan,
          pasien: {
            no_rm: (record.identitas_pasien as any)?.no_rm || '',
            nama_lengkap: (record.identitas_pasien as any)?.nama_lengkap || '',
          },
          diagnosis: firstDiagnosis?.nama_diagnosis,
          kode_icd10: firstDiagnosis?.kode_icd10,
        };
      })
    );

    return recordsWithDiagnosis;
  }

  static async getDosenStats(): Promise<DashboardStats> {
    const { count: mahasiswaCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'mahasiswa');

    const { count: inputCount } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true });

    return {
      totalMahasiswa: mahasiswaCount || 0,
      totalInput: inputCount || 0,
      perluReview: Math.floor((inputCount || 0) * 0.3),
    };
  }

  static async getDosenReviewList(): Promise<DosenReviewItem[]> {
    const { data: kunjunganData, error } = await supabase
      .from('kunjungan_resume')
      .select(`
        id_kunjungan,
        tgl_kunjungan,
        users!kunjungan_resume_metadata_user_buat_fkey (
          full_name
        )
      `)
      .order('tgl_kunjungan', { ascending: false })
      .limit(10);

    if (error || !kunjunganData) {
      return [];
    }

    return kunjunganData.map((record) => ({
      id_kunjungan: record.id_kunjungan,
      mahasiswa_name: (record.users as any)?.full_name || 'Unknown',
      tgl_kunjungan: record.tgl_kunjungan,
      status: 'Menunggu Review',
    }));
  }

  static async getAdminStats(): Promise<DashboardStats> {
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: rekamMedisCount } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: todayCount } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    const { data: storageData } = await supabase.rpc('get_database_size');
    const storageUsed = storageData || '0 MB';

    const { count: totalPasien } = await supabase
      .from('identitas_pasien')
      .select('*', { count: 'exact', head: true });

    const todayDate = new Date().toISOString().split('T')[0];
    const { count: pasienHariIni } = await supabase
      .from('registrasi_kunjungan')
      .select('*', { count: 'exact', head: true })
      .eq('tgl_registrasi', todayDate);

    const { count: totalPegawai } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('role', ['dosen', 'admin']);

    return {
      totalUsers: userCount || 0,
      totalRekamMedis: rekamMedisCount || 0,
      activeToday: todayCount || 0,
      storageUsed: storageUsed,
      totalPasien: totalPasien || 0,
      pasienHariIni: pasienHariIni || 0,
      totalPegawai: totalPegawai || 0,
    };
  }
}
