-- Create table profil_fasyankes
CREATE TABLE IF NOT EXISTS public.profil_fasyankes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_fasyankes TEXT NOT NULL,
    kode_fasyankes TEXT,
    alamat TEXT,
    kota TEXT,
    provinsi TEXT,
    kode_pos TEXT,
    telepon TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    kepala_fasyankes TEXT,
    no_izin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profil_fasyankes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow read access to everyone (authenticated users)
CREATE POLICY "Enable read access for authenticated users" ON public.profil_fasyankes
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert/update access to authenticated users (or restrict to admin if needed)
CREATE POLICY "Enable insert for authenticated users" ON public.profil_fasyankes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.profil_fasyankes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_profil_fasyankes_updated_at
    BEFORE UPDATE ON public.profil_fasyankes
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Insert default data (optional)
INSERT INTO public.profil_fasyankes (nama_fasyankes)
VALUES ('Klinik Pratama')
ON CONFLICT DO NOTHING;
