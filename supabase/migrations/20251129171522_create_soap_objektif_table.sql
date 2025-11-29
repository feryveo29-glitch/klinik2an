/*
  # Create SOAP Objektif Table

  ## Purpose
  Stores objective data (O) from SOAP documentation - physical examination and vital signs.

  ## Tables Created
  
  ### `soap_objektif`
  Records objective clinical findings and vital signs per visit.
  
  **Columns:**
  - `id_objektif` (uuid, primary key) - Unique objective record identifier
  - `id_kunjungan` (uuid, not null, FK) - Reference to visit
  - `keadaan_umum` (text) - General condition
  - `tv_td` (text) - Blood pressure (Tekanan Darah)
  - `tv_nadi` (integer) - Pulse rate
  - `tv_rr` (integer) - Respiratory rate
  - `tv_suhu` (numeric) - Temperature in Celsius
  - `bb` (numeric) - Body weight (Berat Badan) in kg
  - `tb` (numeric) - Height (Tinggi Badan) in cm
  - `fisik_naratif` (text) - Narrative physical examination findings
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ## Foreign Keys
  - `id_kunjungan` → `kunjungan_resume.id_kunjungan`
  - `metadata_user_buat` → `users.id`

  ## Security
  - RLS enabled with standard medical record access policies

  ## Notes
  - Vital signs are critical clinical indicators
  - Physical examination documented in narrative form
*/

-- Create soap_objektif table
CREATE TABLE IF NOT EXISTS soap_objektif (
  id_objektif uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_kunjungan uuid NOT NULL,
  keadaan_umum text,
  tv_td text,
  tv_nadi integer,
  tv_rr integer,
  tv_suhu numeric(4,1),
  bb numeric(5,2),
  tb numeric(5,2),
  fisik_naratif text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_objektif_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan_resume(id_kunjungan) ON DELETE CASCADE,
  CONSTRAINT fk_objektif_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE soap_objektif ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read objective data
CREATE POLICY "Authenticated users can read objective data"
  ON soap_objektif
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create objective data
CREATE POLICY "Authenticated users can create objective data"
  ON soap_objektif
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update objective data
CREATE POLICY "Authenticated users can update objective data"
  ON soap_objektif
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only admins can delete objective data
CREATE POLICY "Only admins can delete objective data"
  ON soap_objektif
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
CREATE INDEX IF NOT EXISTS idx_objektif_kunjungan ON soap_objektif(id_kunjungan);
CREATE INDEX IF NOT EXISTS idx_objektif_user_buat ON soap_objektif(metadata_user_buat);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_soap_objektif_updated_at
  BEFORE UPDATE ON soap_objektif
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
