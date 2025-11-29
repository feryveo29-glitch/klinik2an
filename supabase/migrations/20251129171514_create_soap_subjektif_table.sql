/*
  # Create SOAP Subjektif Table

  ## Purpose
  Stores subjective data (S) from SOAP documentation - patient complaints and history.

  ## Tables Created
  
  ### `soap_subjektif`
  Records patient's subjective complaints and medical history per visit.
  
  **Columns:**
  - `id_subjektif` (uuid, primary key) - Unique subjective record identifier
  - `id_kunjungan` (uuid, not null, FK) - Reference to visit
  - `keluhan_utama` (text, not null) - Chief complaint
  - `rps` (text) - Riwayat Penyakit Sekarang (History of Present Illness)
  - `rpd` (text) - Riwayat Penyakit Dahulu (Past Medical History)
  - `riwayat_obat` (text) - Medication history
  - `riwayat_alergi` (text) - Allergy history
  - `sumber_info` (text) - Information source (patient, family, etc)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ## Foreign Keys
  - `id_kunjungan` → `kunjungan_resume.id_kunjungan`
  - `metadata_user_buat` → `users.id`

  ## Security
  - RLS enabled with standard medical record access policies

  ## Notes
  - One subjective record per visit
  - Critical for clinical decision making
*/

-- Create soap_subjektif table
CREATE TABLE IF NOT EXISTS soap_subjektif (
  id_subjektif uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_kunjungan uuid NOT NULL,
  keluhan_utama text NOT NULL,
  rps text,
  rpd text,
  riwayat_obat text,
  riwayat_alergi text,
  sumber_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_subjektif_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan_resume(id_kunjungan) ON DELETE CASCADE,
  CONSTRAINT fk_subjektif_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE soap_subjektif ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read subjective data
CREATE POLICY "Authenticated users can read subjective data"
  ON soap_subjektif
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create subjective data
CREATE POLICY "Authenticated users can create subjective data"
  ON soap_subjektif
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update subjective data
CREATE POLICY "Authenticated users can update subjective data"
  ON soap_subjektif
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only admins can delete subjective data
CREATE POLICY "Only admins can delete subjective data"
  ON soap_subjektif
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subjektif_kunjungan ON soap_subjektif(id_kunjungan);
CREATE INDEX IF NOT EXISTS idx_subjektif_user_buat ON soap_subjektif(metadata_user_buat);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_soap_subjektif_updated_at
  BEFORE UPDATE ON soap_subjektif
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
