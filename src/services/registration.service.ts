import { supabase } from '../lib/supabase';

export interface Registration {
  id_registrasi: string;
  id_pasien: string;
  id_kunjungan?: string;
  no_antrian: string;
  tgl_registrasi: string;
  waktu_registrasi: string;
  jenis_kunjungan: string;
  jenis_pasien: string;
  poli_tujuan: string;
  keluhan_utama?: string;
  status_registrasi: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface RegistrationWithPatient extends Registration {
  pasien: {
    no_rm: string;
    nama_lengkap: string;
    tgl_lahir: string;
    jenis_kelamin: string;
    no_hp?: string;
  };
}

export interface CreateRegistrationInput {
  id_pasien: string;
  jenis_kunjungan: string;
  jenis_pasien: string;
  poli_tujuan: string;
  keluhan_utama?: string;
  metadata_user_buat?: string;
}

export class RegistrationService {
  static async generateQueueNumber(prefix: string = 'A'): Promise<string> {
    const { data, error } = await supabase.rpc('generate_queue_number', { prefix });

    if (error) {
      console.error('Error generating queue number:', error);
      throw new Error('Gagal generate nomor antrian');
    }

    return data;
  }

  static async createRegistration(input: CreateRegistrationInput): Promise<Registration> {
    const queueNumber = await this.generateQueueNumber('A');

    const { data, error } = await supabase
      .from('registrasi_kunjungan')
      .insert({
        id_pasien: input.id_pasien,
        no_antrian: queueNumber,
        jenis_kunjungan: input.jenis_kunjungan,
        jenis_pasien: input.jenis_pasien,
        poli_tujuan: input.poli_tujuan,
        keluhan_utama: input.keluhan_utama,
        status_registrasi: 'Menunggu',
        metadata_user_buat: input.metadata_user_buat,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating registration:', error);
      throw new Error('Gagal membuat registrasi');
    }

    return data;
  }

  static async getTodayRegistrations(): Promise<RegistrationWithPatient[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('registrasi_kunjungan')
      .select(`
        *,
        identitas_pasien!fk_registrasi_pasien (
          no_rm,
          nama_lengkap,
          tgl_lahir,
          jenis_kelamin,
          no_hp
        )
      `)
      .eq('tgl_registrasi', today)
      .order('no_antrian', { ascending: true });

    if (error) {
      console.error('Error fetching registrations:', error);
      throw new Error('Gagal mengambil data registrasi');
    }

    return data.map((reg: any) => ({
      ...reg,
      pasien: reg.identitas_pasien,
    }));
  }

  static async getRegistrationById(id: string): Promise<RegistrationWithPatient | null> {
    const { data, error } = await supabase
      .from('registrasi_kunjungan')
      .select(`
        *,
        identitas_pasien!fk_registrasi_pasien (
          no_rm,
          nama_lengkap,
          tgl_lahir,
          jenis_kelamin,
          no_hp
        )
      `)
      .eq('id_registrasi', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching registration:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      pasien: data.identitas_pasien,
    };
  }

  static async updateRegistrationStatus(
    id: string,
    status: 'Menunggu' | 'Dipanggil' | 'Selesai' | 'Batal'
  ): Promise<void> {
    const { error } = await supabase
      .from('registrasi_kunjungan')
      .update({ status_registrasi: status })
      .eq('id_registrasi', id);

    if (error) {
      console.error('Error updating registration status:', error);
      throw new Error('Gagal update status registrasi');
    }
  }

  static async linkToVisit(registrationId: string, visitId: string): Promise<void> {
    const { error } = await supabase
      .from('registrasi_kunjungan')
      .update({
        id_kunjungan: visitId,
        status_registrasi: 'Selesai'
      })
      .eq('id_registrasi', registrationId);

    if (error) {
      console.error('Error linking registration to visit:', error);
      throw new Error('Gagal menghubungkan registrasi dengan kunjungan');
    }
  }

  static async getPatientRegistrationHistory(patientId: string): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrasi_kunjungan')
      .select('*')
      .eq('id_pasien', patientId)
      .order('tgl_registrasi', { ascending: false })
      .order('waktu_registrasi', { ascending: false });

    if (error) {
      console.error('Error fetching patient registrations:', error);
      throw new Error('Gagal mengambil riwayat registrasi');
    }

    return data;
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
