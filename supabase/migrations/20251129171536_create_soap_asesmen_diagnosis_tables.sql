/*
  # Create SOAP Assessment and Diagnosis Tables

  ## Purpose
  Stores assessment (A) from SOAP documentation - clinical impressions and diagnoses.
  Implements Head-Detail pattern for diagnosis recording.

  ## Tables Created
  
  ### `soap_asesmen_diagnosis` (Head)
  Main assessment record per visit containing clinical notes.
  
  **Columns:**
  - `id_asesmen` (uuid, primary key) - Unique assessment identifier
  - `id_kunjungan` (uuid, not null, FK) - Reference to visit
  - `catatan_klinis` (text) - Clinical notes/impression
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ### `diagnosis` (Detail)
  Individual diagnosis entries linked to assessment.
  
  **Columns:**
  - `id_diagnosis` (uuid, primary key) - Unique diagnosis identifier
  - `id_asesmen` (uuid, not null, FK) - Reference to assessment
  - `jenis_diagnosis` (text, not null) - Diagnosis type (primer, sekunder, komplikasi)
  - `kode_icd10` (text, not null) - ICD-10 code
  - `nama_diagnosis` (text, not null) - Diagnosis name/description
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ## Foreign Keys
  - `soap_asesmen_diagnosis.id_kunjungan` → `kunjungan_resume.id_kunjungan`
  - `diagnosis.id_asesmen` → `soap_asesmen_diagnosis.id_asesmen`
  - `metadata_user_buat` → `users.id`

  ## Security
  - RLS enabled on both tables with standard medical record access policies

  ## Notes
  - One assessment per visit, multiple diagnoses per assessment
  - ICD-10 codes follow WHO international classification
  - Diagnosis type helps prioritize clinical conditions
*/

-- Create soap_asesmen_diagnosis table (Head)
CREATE TABLE IF NOT EXISTS soap_asesmen_diagnosis (
  id_asesmen uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_kunjungan uuid NOT NULL,
  catatan_klinis text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_asesmen_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan_resume(id_kunjungan) ON DELETE CASCADE,
  CONSTRAINT fk_asesmen_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Create diagnosis table (Detail)
CREATE TABLE IF NOT EXISTS diagnosis (
  id_diagnosis uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_asesmen uuid NOT NULL,
  jenis_diagnosis text NOT NULL,
  kode_icd10 text NOT NULL,
  nama_diagnosis text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_diagnosis_asesmen FOREIGN KEY (id_asesmen) REFERENCES soap_asesmen_diagnosis(id_asesmen) ON DELETE CASCADE,
  CONSTRAINT fk_diagnosis_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS on soap_asesmen_diagnosis
ALTER TABLE soap_asesmen_diagnosis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read assessments"
  ON soap_asesmen_diagnosis FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create assessments"
  ON soap_asesmen_diagnosis FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update assessments"
  ON soap_asesmen_diagnosis FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete assessments"
  ON soap_asesmen_diagnosis FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Enable RLS on diagnosis
ALTER TABLE diagnosis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read diagnoses"
  ON diagnosis FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create diagnoses"
  ON diagnosis FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update diagnoses"
  ON diagnosis FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete diagnoses"
  ON diagnosis FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for soap_asesmen_diagnosis
CREATE INDEX IF NOT EXISTS idx_asesmen_kunjungan ON soap_asesmen_diagnosis(id_kunjungan);
CREATE INDEX IF NOT EXISTS idx_asesmen_user_buat ON soap_asesmen_diagnosis(metadata_user_buat);

-- Create indexes for diagnosis
CREATE INDEX IF NOT EXISTS idx_diagnosis_asesmen ON diagnosis(id_asesmen);
CREATE INDEX IF NOT EXISTS idx_diagnosis_icd10 ON diagnosis(kode_icd10);
CREATE INDEX IF NOT EXISTS idx_diagnosis_jenis ON diagnosis(jenis_diagnosis);
CREATE INDEX IF NOT EXISTS idx_diagnosis_user_buat ON diagnosis(metadata_user_buat);

-- Triggers to auto-update updated_at
CREATE TRIGGER update_soap_asesmen_diagnosis_updated_at
  BEFORE UPDATE ON soap_asesmen_diagnosis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnosis_updated_at
  BEFORE UPDATE ON diagnosis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
