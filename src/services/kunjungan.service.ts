import { supabase } from '../lib/supabase';
import type {
  KunjunganResume,
  KunjunganWithRelations,
  SoapSubjektif,
  SoapObjektif,
  SoapAsesmenDiagnosis,
  SoapPlan,
  User
} from '../types/database.types';

export class KunjunganService {
  private static async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }

  private static async getCurrentUserRole(): Promise<'admin' | 'dosen' | 'mahasiswa' | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data.role as 'admin' | 'dosen' | 'mahasiswa';
  }

  static async create(kunjungan: Omit<KunjunganResume, 'id_kunjungan' | 'created_at' | 'updated_at' | 'metadata_user_buat'>): Promise<KunjunganResume | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from('kunjungan_resume')
      .insert({
        ...kunjungan,
        metadata_user_buat: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating kunjungan:', error);
      return null;
    }

    return data;
  }

  static async getById(id_kunjungan: string): Promise<KunjunganWithRelations | null> {
    const { data, error } = await supabase
      .from('kunjungan_resume')
      .select(`
        *,
        pasien:identitas_pasien!kunjungan_resume_id_pasien_fkey(*),
        subjektif:soap_subjektif(*),
        objektif:soap_objektif(*),
        pemeriksaan_penunjang(*),
        asesmen:soap_asesmen_diagnosis(*),
        plan:soap_plan(*),
        uploader:users!kunjungan_resume_metadata_user_buat_fkey(id, full_name, role)
      `)
      .eq('id_kunjungan', id_kunjungan)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching kunjungan:', error);
      return null;
    }

    return await this.applyVisibilityRules(data);
  }

  static async getAll(): Promise<KunjunganWithRelations[]> {
    const { data, error } = await supabase
      .from('kunjungan_resume')
      .select(`
        *,
        pasien:identitas_pasien!kunjungan_resume_id_pasien_fkey(*),
        uploader:users!kunjungan_resume_metadata_user_buat_fkey(id, full_name, role)
      `)
      .order('tgl_kunjungan', { ascending: false });

    if (error || !data) {
      console.error('Error fetching kunjungan list:', error);
      return [];
    }

    return Promise.all(data.map(item => this.applyVisibilityRules(item)));
  }

  static async getByPasienId(id_pasien: string): Promise<KunjunganWithRelations[]> {
    const { data, error } = await supabase
      .from('kunjungan_resume')
      .select(`
        *,
        pasien:identitas_pasien!kunjungan_resume_id_pasien_fkey(*),
        uploader:users!kunjungan_resume_metadata_user_buat_fkey(id, full_name, role)
      `)
      .eq('id_pasien', id_pasien)
      .order('tgl_kunjungan', { ascending: false });

    if (error || !data) {
      console.error('Error fetching patient kunjungan:', error);
      return [];
    }

    return Promise.all(data.map(item => this.applyVisibilityRules(item)));
  }

  private static async applyVisibilityRules(kunjungan: any): Promise<KunjunganWithRelations> {
    const userRole = await this.getCurrentUserRole();

    if (userRole === 'mahasiswa') {
      kunjungan.uploader_name = 'Anonymous';
    } else {
      kunjungan.uploader_name = kunjungan.uploader?.full_name || 'Unknown';
    }

    return kunjungan;
  }

  static async createSubjektif(subjektif: Omit<SoapSubjektif, 'id_subjektif' | 'created_at' | 'updated_at' | 'metadata_user_buat'>): Promise<SoapSubjektif | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from('soap_subjektif')
      .insert({
        ...subjektif,
        metadata_user_buat: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subjektif:', error);
      return null;
    }

    return data;
  }

  static async createObjektif(objektif: Omit<SoapObjektif, 'id_objektif' | 'created_at' | 'updated_at' | 'metadata_user_buat'>): Promise<SoapObjektif | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from('soap_objektif')
      .insert({
        ...objektif,
        metadata_user_buat: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating objektif:', error);
      return null;
    }

    return data;
  }

  static async createAsesmen(asesmen: Omit<SoapAsesmenDiagnosis, 'id_asesmen' | 'created_at' | 'updated_at' | 'metadata_user_buat'>): Promise<SoapAsesmenDiagnosis | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from('soap_asesmen_diagnosis')
      .insert({
        ...asesmen,
        metadata_user_buat: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating asesmen:', error);
      return null;
    }

    return data;
  }

  static async createPlan(plan: Omit<SoapPlan, 'id_plan' | 'created_at' | 'updated_at' | 'metadata_user_buat'>): Promise<SoapPlan | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from('soap_plan')
      .insert({
        ...plan,
        metadata_user_buat: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating plan:', error);
      return null;
    }

    return data;
  }

  static getUploaderName(kunjungan: KunjunganWithRelations): string {
    return kunjungan.uploader_name || 'Unknown';
  }
}
