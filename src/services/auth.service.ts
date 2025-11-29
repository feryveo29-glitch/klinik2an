import { supabase } from '../lib/supabase';
import type { User } from '../types/database.types';

export class AuthService {
  static async signIn(username: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (userError || !userData) {
      return { user: null, error: 'Username atau password salah' };
    }

    if (userData.password !== password) {
      return { user: null, error: 'Username atau password salah' };
    }

    return { user: userData, error: null };
  }

  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  }

  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  static async getUserRole(): Promise<'admin' | 'dosen' | 'mahasiswa' | null> {
    const user = await this.getCurrentUser();
    return user?.role || null;
  }
}
