import { supabase } from '../lib/supabase';

export interface UserData {
  id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'dosen' | 'mahasiswa';
  nim?: string | null;
  nip?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  full_name: string;
  role: 'admin' | 'dosen' | 'mahasiswa';
  nim?: string;
  nip?: string;
}

export interface UpdateUserData {
  username?: string;
  password?: string;
  full_name?: string;
  role?: 'admin' | 'dosen' | 'mahasiswa';
  nim?: string;
  nip?: string;
}

export interface BulkUploadMahasiswaData {
  nim: string;
  full_name: string;
  password: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export class UserService {
  static async getAllUsers(): Promise<UserData[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data || [];
  }

  static async getUserById(id: string): Promise<UserData | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  static async createUser(userData: CreateUserData): Promise<{ success: boolean; error?: string }> {
    if (userData.role === 'mahasiswa' && userData.nim) {
      const { data: existingNim } = await supabase
        .from('users')
        .select('nim')
        .eq('nim', userData.nim)
        .maybeSingle();

      if (existingNim) {
        return { success: false, error: 'NIM sudah digunakan' };
      }
    }

    if ((userData.role === 'dosen' || userData.role === 'admin') && userData.nip) {
      const { data: existingNip } = await supabase
        .from('users')
        .select('nip')
        .eq('nip', userData.nip)
        .maybeSingle();

      if (existingNip) {
        return { success: false, error: 'NIP sudah digunakan' };
      }
    }

    const insertData: any = {
      username: userData.username,
      password: userData.password,
      full_name: userData.full_name,
      role: userData.role,
    };

    if (userData.role === 'mahasiswa' && userData.nim) {
      insertData.nim = userData.nim;
    }

    if ((userData.role === 'dosen' || userData.role === 'admin') && userData.nip) {
      insertData.nip = userData.nip;
    }

    const { error } = await supabase
      .from('users')
      .insert(insertData);

    if (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Gagal membuat user' };
    }

    return { success: true };
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<{ success: boolean; error?: string }> {
    if (userData.nim) {
      const { data: existingNim } = await supabase
        .from('users')
        .select('nim, id')
        .eq('nim', userData.nim)
        .maybeSingle();

      if (existingNim && existingNim.id !== id) {
        return { success: false, error: 'NIM sudah digunakan' };
      }
    }

    if (userData.nip) {
      const { data: existingNip } = await supabase
        .from('users')
        .select('nip, id')
        .eq('nip', userData.nip)
        .maybeSingle();

      if (existingNip && existingNip.id !== id) {
        return { success: false, error: 'NIP sudah digunakan' };
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (userData.username) updateData.username = userData.username;
    if (userData.full_name) updateData.full_name = userData.full_name;
    if (userData.role) updateData.role = userData.role;
    if (userData.password) updateData.password = userData.password;
    if (userData.nim !== undefined) updateData.nim = userData.nim || null;
    if (userData.nip !== undefined) updateData.nip = userData.nip || null;

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Gagal mengupdate user' };
    }

    return { success: true };
  }

  static async deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
    const { count: kunjunganCount } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true })
      .eq('metadata_user_buat', id);

    if (kunjunganCount && kunjunganCount > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus user. User ini memiliki ${kunjunganCount} rekam medis terkait.`
      };
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Gagal menghapus user' };
    }

    return { success: true };
  }

  static async getUserStats(userId: string): Promise<{ totalRecords: number; lastActivity?: string }> {
    const { count } = await supabase
      .from('kunjungan_resume')
      .select('*', { count: 'exact', head: true })
      .eq('metadata_user_buat', userId);

    const { data: lastActivity } = await supabase
      .from('kunjungan_resume')
      .select('tgl_kunjungan')
      .eq('metadata_user_buat', userId)
      .order('tgl_kunjungan', { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      totalRecords: count || 0,
      lastActivity: lastActivity?.tgl_kunjungan,
    };
  }

  static validateBulkUploadData(data: BulkUploadMahasiswaData[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const nimSet = new Set<string>();

    data.forEach((row, index) => {
      const rowNumber = index + 2;

      if (!row.nim || row.nim.trim() === '') {
        errors.push({
          row: rowNumber,
          field: 'NIM',
          message: 'NIM tidak boleh kosong'
        });
      } else if (nimSet.has(row.nim)) {
        errors.push({
          row: rowNumber,
          field: 'NIM',
          message: `NIM ${row.nim} duplikat dalam file`
        });
      } else {
        nimSet.add(row.nim);
      }

      if (!row.full_name || row.full_name.trim() === '') {
        errors.push({
          row: rowNumber,
          field: 'Nama Lengkap',
          message: 'Nama lengkap tidak boleh kosong'
        });
      }

      if (!row.password || row.password.trim() === '') {
        errors.push({
          row: rowNumber,
          field: 'Password',
          message: 'Password tidak boleh kosong'
        });
      } else if (row.password.length < 6) {
        errors.push({
          row: rowNumber,
          field: 'Password',
          message: 'Password minimal 6 karakter'
        });
      }
    });

    return errors;
  }

  static async bulkUploadMahasiswa(data: BulkUploadMahasiswaData[]): Promise<{
    success: boolean;
    inserted: number;
    failed: number;
    errors: Array<{ nim: string; error: string }>;
  }> {
    const validationErrors = this.validateBulkUploadData(data);

    if (validationErrors.length > 0) {
      return {
        success: false,
        inserted: 0,
        failed: data.length,
        errors: validationErrors.map(e => ({
          nim: data[e.row - 2]?.nim || 'unknown',
          error: `Baris ${e.row}, ${e.field}: ${e.message}`
        }))
      };
    }

    const existingNims = await this.checkExistingNims(data.map(d => d.nim));

    let inserted = 0;
    let failed = 0;
    const errors: Array<{ nim: string; error: string }> = [];

    for (const row of data) {
      if (existingNims.includes(row.nim)) {
        failed++;
        errors.push({
          nim: row.nim,
          error: `NIM ${row.nim} sudah terdaftar di sistem`
        });
        continue;
      }

      const result = await this.createUser({
        username: row.nim,
        password: row.password,
        full_name: row.full_name,
        role: 'mahasiswa',
        nim: row.nim,
      });

      if (result.success) {
        inserted++;
      } else {
        failed++;
        errors.push({
          nim: row.nim,
          error: result.error || 'Gagal membuat user'
        });
      }
    }

    return {
      success: inserted > 0,
      inserted,
      failed,
      errors
    };
  }

  static async checkExistingNims(nims: string[]): Promise<string[]> {
    const { data, error } = await supabase
      .from('users')
      .select('nim')
      .in('nim', nims);

    if (error) {
      console.error('Error checking existing NIMs:', error);
      return [];
    }

    return (data || []).map(u => u.nim).filter(Boolean) as string[];
  }
}
