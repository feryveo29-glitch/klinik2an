import { supabase } from '../lib/supabase';

export interface AppSetting {
    key: string;
    value: any;
    description?: string;
    updated_at: string;
}

export const settingsService = {
    async getSetting<T>(key: string, defaultValue: T): Promise<T> {
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error || !data) {
            return defaultValue;
        }

        return data.value as T;
    },

    async updateSetting(key: string, value: any) {
        const { data, error } = await supabase
            .from('app_settings')
            .upsert({
                key,
                value,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data as AppSetting;
    }
};
