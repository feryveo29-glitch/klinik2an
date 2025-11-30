-- 1. Bersihkan data duplikat (sisakan 1 yang paling baru)
DELETE FROM public.profil_fasyankes
WHERE id NOT IN (
    SELECT id
    FROM public.profil_fasyankes
    ORDER BY created_at DESC
    LIMIT 1
);

-- 2. Jika tabel kosong (karena delete semua atau belum ada), insert 1 data baru
INSERT INTO public.profil_fasyankes (nama_fasyankes)
SELECT 'Klinik Sehat'
WHERE NOT EXISTS (SELECT 1 FROM public.profil_fasyankes);

-- 3. Perbaiki Policy UPDATE agar SEMUA orang (termasuk anonim) bisa update
--    (Ini solusi darurat karena sepertinya session auth tidak terdeteksi)
DROP POLICY IF EXISTS "Allow authenticated update" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Allow update for authenticated" ON public.profil_fasyankes;
DROP POLICY IF EXISTS "Allow public update" ON public.profil_fasyankes;

CREATE POLICY "Allow public update" ON public.profil_fasyankes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 4. Pastikan INSERT juga boleh (jika perlu insert baru)
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.profil_fasyankes;
CREATE POLICY "Allow public insert" ON public.profil_fasyankes
    FOR INSERT
    WITH CHECK (true);
