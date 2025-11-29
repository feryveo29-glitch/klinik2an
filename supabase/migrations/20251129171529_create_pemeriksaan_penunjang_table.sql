/*
  # Create Pemeriksaan Penunjang Table

  ## Purpose
  Stores diagnostic/supporting examination results (lab, radiology, etc).

  ## Tables Created
  
  ### `pemeriksaan_penunjang`
  Records all diagnostic and supporting examination results per visit.
  
  **Columns:**
  - `id_pemeriksaan` (uuid, primary key) - Unique examination identifier
  - `id_kunjungan` (uuid, not null, FK) - Reference to visit
  - `jenis` (text, not null) - Examination type (laboratorium, radiologi, etc)
  - `nama_pemeriksaan` (text, not null) - Examination name
  - `hasil` (text) - Result value
  - `satuan` (text) - Unit of measurement
  - `id_file_lampiran` (uuid) - Attachment file ID (if applicable)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ## Foreign Keys
  - `id_kunjungan` → `kunjungan_resume.id_kunjungan`
  - `metadata_user_buat` → `users.id`

  ## Security
  - RLS enabled with standard medical record access policies

  ## Notes
  - Multiple examinations can be recorded per visit
  - Supports various examination types (lab, imaging, etc)
  - Optional file attachments for scanned results
*/

-- Create pemeriksaan_penunjang table
CREATE TABLE IF NOT EXISTS pemeriksaan_penunjang (
  id_pemeriksaan uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_kunjungan uuid NOT NULL,
  jenis text NOT NULL,
  nama_pemeriksaan text NOT NULL,
  hasil text,
  satuan text,
  id_file_lampiran uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_pemeriksaan_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan_resume(id_kunjungan) ON DELETE CASCADE,
  CONSTRAINT fk_pemeriksaan_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE pemeriksaan_penunjang ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read examination data
CREATE POLICY "Authenticated users can read examinations"
  ON pemeriksaan_penunjang
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create examination data
CREATE POLICY "Authenticated users can create examinations"
  ON pemeriksaan_penunjang
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update examination data
CREATE POLICY "Authenticated users can update examinations"
  ON pemeriksaan_penunjang
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only admins can delete examination data
CREATE POLICY "Only admins can delete examinations"
  ON pemeriksaan_penunjang
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
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_kunjungan ON pemeriksaan_penunjang(id_kunjungan);
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_jenis ON pemeriksaan_penunjang(jenis);
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_user_buat ON pemeriksaan_penunjang(metadata_user_buat);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_pemeriksaan_penunjang_updated_at
  BEFORE UPDATE ON pemeriksaan_penunjang
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
