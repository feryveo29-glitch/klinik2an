import { supabase } from '../lib/supabase';
import type { ProfilFasyankes } from '../types/database.types';

export const facilityService = {
    async getProfil() {
        // Ambil data pertama saja karena asumsinya 1 klinik 1 profil
        const { data, error } = await supabase
            .from('profil_fasyankes')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            // Jika error karena data kosong (PGRST116), return null tanpa throw error
            if (error.code === 'PGRST116') return { data: null, error: null };
            return { data: null, error };
        }

        return { data: data as ProfilFasyankes, error: null };
    },

    async updateProfil(profil: Partial<ProfilFasyankes>) {
        // Cek apakah data sudah ada
        const { data: existing } = await this.getProfil();

        let result;
        if (existing) {
            // Update existing
            // Kita tidak menggunakan .select() untuk menghindari error 406 jika RLS memblokir read
            result = await supabase
                .from('profil_fasyankes')
                .update({ ...profil, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
        } else {
            // Insert new
            result = await supabase
                .from('profil_fasyankes')
                .insert([{ ...profil, created_at: new Date().toISOString() }])
                .select()
                .single();
        }

        return result;
    }
};
