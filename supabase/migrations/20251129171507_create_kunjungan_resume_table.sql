/*
  # Create Kunjungan Resume Table

  ## Purpose
  Records patient visits and encounters in the medical record system.
  This is the core table that links patient identity to clinical data.

  ## Tables Created
  
  ### `kunjungan_resume`
  Stores visit/encounter information for each patient interaction.
  
  **Columns:**
  - `id_kunjungan` (uuid, primary key) - Unique visit identifier
  - `id_pasien` (uuid, not null, FK) - Reference to patient
  - `tgl_kunjungan` (timestamptz, not null) - Date and time of visit
  - `jenis_kunjungan` (text, not null) - Visit type (rawat jalan, rawat inap, etc)
  - `jenis_pasien` (text, not null) - Patient type (umum, BPJS, asuransi, etc)
  - `unit_pelayanan` (text, not null) - Service unit/department
  - `tenaga_medis_pj` (text, not null) - Medical personnel in charge
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ## Foreign Keys
  - `id_pasien` → `identitas_pasien.id_pasien`
  - `metadata_user_buat` → `users.id`

  ## Security
  - RLS enabled
  - Authenticated users can view all visits
  - Only authenticated users can create/update visits
  - Only admins can delete visits

  ## Indexes
  - Patient ID for patient visit history
  - Visit date for chronological queries
  - Service unit for department reports
*/

-- Create kunjungan_resume table
CREATE TABLE IF NOT EXISTS kunjungan_resume (
  id_kunjungan uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pasien uuid NOT NULL,
  tgl_kunjungan timestamptz NOT NULL DEFAULT now(),
  jenis_kunjungan text NOT NULL,
  jenis_pasien text NOT NULL,
  unit_pelayanan text NOT NULL,
  tenaga_medis_pj text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_kunjungan_pasien FOREIGN KEY (id_pasien) REFERENCES identitas_pasien(id_pasien) ON DELETE CASCADE,
  CONSTRAINT fk_kunjungan_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE kunjungan_resume ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all visits
CREATE POLICY "Authenticated users can read visits"
  ON kunjungan_resume
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create visits
CREATE POLICY "Authenticated users can create visits"
  ON kunjungan_resume
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update visits
CREATE POLICY "Authenticated users can update visits"
  ON kunjungan_resume
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only admins can delete visits
CREATE POLICY "Only admins can delete visits"
  ON kunjungan_resume
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
CREATE INDEX IF NOT EXISTS idx_kunjungan_id_pasien ON kunjungan_resume(id_pasien);
CREATE INDEX IF NOT EXISTS idx_kunjungan_tgl ON kunjungan_resume(tgl_kunjungan DESC);
CREATE INDEX IF NOT EXISTS idx_kunjungan_unit ON kunjungan_resume(unit_pelayanan);
CREATE INDEX IF NOT EXISTS idx_kunjungan_user_buat ON kunjungan_resume(metadata_user_buat);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_kunjungan_resume_updated_at
  BEFORE UPDATE ON kunjungan_resume
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
