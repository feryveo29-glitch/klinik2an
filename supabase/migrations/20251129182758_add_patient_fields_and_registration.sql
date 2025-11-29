/*
  # Add Patient Fields and Registration Table

  1. Changes to identitas_pasien table
    - Add `tempat_lahir` (text) - Place of birth
    - Add `agama` (text) - Religion
    - Add `golongan_darah` (text) - Blood type
    - Add `nama_ibu` (text) - Mother's name
    - Add `nama_ayah` (text) - Father's name
    - Add `nama_wali` (text) - Guardian's name (if applicable)
    - Add `no_hp_wali` (text) - Guardian's phone number
    - Add `email` (text) - Email address

  2. New Tables
    - `registrasi_kunjungan` - Patient visit registration with queue number
      - `id_registrasi` (uuid, primary key) - Unique registration ID
      - `id_pasien` (uuid, FK) - Patient ID
      - `id_kunjungan` (uuid, FK, nullable) - Visit ID (filled after medical record created)
      - `no_antrian` (text, not null) - Queue number (format: A001, A002, etc)
      - `tgl_registrasi` (date, not null) - Registration date
      - `waktu_registrasi` (timestamptz, not null) - Registration time
      - `jenis_kunjungan` (text, not null) - Visit type (Rawat Jalan, IGD, etc)
      - `jenis_pasien` (text, not null) - Patient type (Umum, BPJS, Asuransi)
      - `poli_tujuan` (text, not null) - Destination clinic/department
      - `keluhan_utama` (text) - Main complaint
      - `status_registrasi` (text, not null) - Status (Menunggu, Dipanggil, Selesai, Batal)
      - `metadata_user_buat` (uuid, FK) - User who created registration
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  3. Security
    - RLS enabled for all tables
    - Anon and authenticated users can perform operations
    - Application-level security enforced

  4. Indexes
    - Registration date and queue number for quick lookups
    - Patient ID for patient history
    - Status for queue management
*/

-- Add new columns to identitas_pasien
ALTER TABLE identitas_pasien
  ADD COLUMN IF NOT EXISTS tempat_lahir text,
  ADD COLUMN IF NOT EXISTS agama text,
  ADD COLUMN IF NOT EXISTS golongan_darah text,
  ADD COLUMN IF NOT EXISTS nama_ibu text,
  ADD COLUMN IF NOT EXISTS nama_ayah text,
  ADD COLUMN IF NOT EXISTS nama_wali text,
  ADD COLUMN IF NOT EXISTS no_hp_wali text,
  ADD COLUMN IF NOT EXISTS email text;

-- Create registrasi_kunjungan table
CREATE TABLE IF NOT EXISTS registrasi_kunjungan (
  id_registrasi uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pasien uuid NOT NULL,
  id_kunjungan uuid,
  no_antrian text NOT NULL,
  tgl_registrasi date NOT NULL DEFAULT CURRENT_DATE,
  waktu_registrasi timestamptz NOT NULL DEFAULT now(),
  jenis_kunjungan text NOT NULL,
  jenis_pasien text NOT NULL,
  poli_tujuan text NOT NULL,
  keluhan_utama text,
  status_registrasi text NOT NULL DEFAULT 'Menunggu',
  metadata_user_buat uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_registrasi_pasien FOREIGN KEY (id_pasien) REFERENCES identitas_pasien(id_pasien) ON DELETE CASCADE,
  CONSTRAINT fk_registrasi_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan_resume(id_kunjungan) ON DELETE SET NULL,
  CONSTRAINT fk_registrasi_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE registrasi_kunjungan ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registrasi_kunjungan
CREATE POLICY "Allow anon full access to registrations"
  ON registrasi_kunjungan FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to registrations"
  ON registrasi_kunjungan FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrasi_id_pasien ON registrasi_kunjungan(id_pasien);
CREATE INDEX IF NOT EXISTS idx_registrasi_tgl ON registrasi_kunjungan(tgl_registrasi DESC);
CREATE INDEX IF NOT EXISTS idx_registrasi_no_antrian ON registrasi_kunjungan(no_antrian);
CREATE INDEX IF NOT EXISTS idx_registrasi_status ON registrasi_kunjungan(status_registrasi);
CREATE INDEX IF NOT EXISTS idx_registrasi_poli ON registrasi_kunjungan(poli_tujuan);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_registrasi_kunjungan_updated_at
  BEFORE UPDATE ON registrasi_kunjungan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate queue number for today
CREATE OR REPLACE FUNCTION generate_queue_number(prefix text DEFAULT 'A')
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today_date date := CURRENT_DATE;
  last_number int;
  new_number text;
BEGIN
  -- Get last queue number for today
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(no_antrian FROM '[0-9]+') AS INTEGER)),
    0
  ) INTO last_number
  FROM registrasi_kunjungan
  WHERE tgl_registrasi = today_date
    AND no_antrian ~ ('^' || prefix || '[0-9]+$');
  
  -- Generate new number with leading zeros
  new_number := prefix || LPAD((last_number + 1)::text, 3, '0');
  
  RETURN new_number;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION generate_queue_number(text) TO anon;
GRANT EXECUTE ON FUNCTION generate_queue_number(text) TO authenticated;
