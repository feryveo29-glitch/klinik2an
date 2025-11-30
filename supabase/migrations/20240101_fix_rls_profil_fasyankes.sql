-- Drop policy lama yang mungkin bermasalah
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Allow read access for all" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Allow update for authenticated" ON public.profil_fasyankes;

-- Buat policy baru yang lebih permisif dan pasti jalan
-- 1. Izinkan SEMUA orang (termasuk yang belum login) untuk MEMBACA data profil klinik
--    Ini penting agar halaman login bisa menampilkan nama klinik
CREATE POLICY "Allow public read access" ON public.profil_fasyankes
    FOR SELECT
    USING (true);

-- 2. Izinkan user yang LOGIN (authenticated) untuk INSERT data
CREATE POLICY "Allow authenticated insert" ON public.profil_fasyankes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. Izinkan user yang LOGIN (authenticated) untuk UPDATE data
CREATE POLICY "Allow authenticated update" ON public.profil_fasyankes
    FOR UPDATE
    TO authenticated
    USING (true);

-- Pastikan ada 1 data awal agar tidak perlu INSERT manual
INSERT INTO public.profil_fasyankes (nama_fasyankes)
VALUES ('Klinik Sehat')
ON CONFLICT DO NOTHING;
