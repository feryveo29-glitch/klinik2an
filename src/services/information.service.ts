import { supabase } from '../lib/supabase';

export interface Information {
    id: string;
    pesan: string;
    aktif: boolean;
    tipe: 'info' | 'warning' | 'success';
    created_at: string;
    updated_at: string;
}

export const informationService = {
    async getActiveInformation() {
        const { data, error } = await supabase
            .from('informasi_running_text')
            .select('*')
            .eq('aktif', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Information[];
    },

    async getAllInformation() {
        const { data, error } = await supabase
            .from('informasi_running_text')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Information[];
    },

    async createInformation(pesan: string, tipe: 'info' | 'warning' | 'success' = 'info') {
        const { data, error } = await supabase
            .from('informasi_running_text')
            .insert({ pesan, tipe })
            .select()
            .single();

        if (error) throw error;
        return data as Information;
    },

    async updateInformation(id: string, updates: Partial<Information>) {
        const { data, error } = await supabase
            .from('informasi_running_text')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Information;
    },

    async deleteInformation(id: string) {
        const { error } = await supabase
            .from('informasi_running_text')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
