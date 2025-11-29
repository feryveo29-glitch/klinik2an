/*
  # Create SOAP Plan Tables (with Details)

  ## Purpose
  Stores plan (P) from SOAP documentation - treatment plans, procedures, and medications.
  Implements Head-Detail pattern for comprehensive treatment planning.

  ## Tables Created
  
  ### `soap_plan` (Head)
  Main treatment plan record per visit.
  
  **Columns:**
  - `id_plan` (uuid, primary key) - Unique plan identifier
  - `id_kunjungan` (uuid, not null, FK) - Reference to visit
  - `rencana_umum` (text) - General treatment plan
  - `rencana_kontrol` (text) - Follow-up control plan
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ### `tindakan_medis` (Detail)
  Medical procedures/interventions linked to plan.
  
  **Columns:**
  - `id_tindakan` (uuid, primary key) - Unique procedure identifier
  - `id_plan` (uuid, not null, FK) - Reference to plan
  - `kode_tindakan` (text) - Procedure code (ICD-9-CM or local code)
  - `nama_tindakan` (text, not null) - Procedure name
  - `pelaksana` (text) - Practitioner performing the procedure
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ### `terapi_obat` (Detail)
  Medication therapy linked to plan.
  
  **Columns:**
  - `id_terapi` (uuid, primary key) - Unique therapy identifier
  - `id_plan` (uuid, not null, FK) - Reference to plan
  - `nama_obat` (text, not null) - Medication name
  - `dosis` (text, not null) - Dosage
  - `frekuensi` (text, not null) - Frequency (e.g., 3x sehari)
  - `rute` (text, not null) - Route of administration (oral, IV, etc)
  - `durasi` (text) - Duration of therapy
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK) - User who created the record

  ## Foreign Keys
  - `soap_plan.id_kunjungan` → `kunjungan_resume.id_kunjungan`
  - `tindakan_medis.id_plan` → `soap_plan.id_plan`
  - `terapi_obat.id_plan` → `soap_plan.id_plan`
  - `metadata_user_buat` → `users.id`

  ## Security
  - RLS enabled on all tables with standard medical record access policies

  ## Notes
  - One plan per visit, multiple procedures and medications per plan
  - Supports comprehensive treatment documentation
  - Critical for clinical workflow and billing
*/

-- Create soap_plan table (Head)
CREATE TABLE IF NOT EXISTS soap_plan (
  id_plan uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_kunjungan uuid NOT NULL,
  rencana_umum text,
  rencana_kontrol text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_plan_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan_resume(id_kunjungan) ON DELETE CASCADE,
  CONSTRAINT fk_plan_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Create tindakan_medis table (Detail)
CREATE TABLE IF NOT EXISTS tindakan_medis (
  id_tindakan uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_plan uuid NOT NULL,
  kode_tindakan text,
  nama_tindakan text NOT NULL,
  pelaksana text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_tindakan_plan FOREIGN KEY (id_plan) REFERENCES soap_plan(id_plan) ON DELETE CASCADE,
  CONSTRAINT fk_tindakan_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Create terapi_obat table (Detail)
CREATE TABLE IF NOT EXISTS terapi_obat (
  id_terapi uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_plan uuid NOT NULL,
  nama_obat text NOT NULL,
  dosis text NOT NULL,
  frekuensi text NOT NULL,
  rute text NOT NULL,
  durasi text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  CONSTRAINT fk_terapi_plan FOREIGN KEY (id_plan) REFERENCES soap_plan(id_plan) ON DELETE CASCADE,
  CONSTRAINT fk_terapi_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id)
);

-- Enable RLS on soap_plan
ALTER TABLE soap_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read plans"
  ON soap_plan FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create plans"
  ON soap_plan FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update plans"
  ON soap_plan FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete plans"
  ON soap_plan FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Enable RLS on tindakan_medis
ALTER TABLE tindakan_medis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read procedures"
  ON tindakan_medis FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create procedures"
  ON tindakan_medis FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update procedures"
  ON tindakan_medis FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete procedures"
  ON tindakan_medis FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Enable RLS on terapi_obat
ALTER TABLE terapi_obat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read medications"
  ON terapi_obat FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create medications"
  ON terapi_obat FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update medications"
  ON terapi_obat FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete medications"
  ON terapi_obat FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Create indexes for soap_plan
CREATE INDEX IF NOT EXISTS idx_plan_kunjungan ON soap_plan(id_kunjungan);
CREATE INDEX IF NOT EXISTS idx_plan_user_buat ON soap_plan(metadata_user_buat);

-- Create indexes for tindakan_medis
CREATE INDEX IF NOT EXISTS idx_tindakan_plan ON tindakan_medis(id_plan);
CREATE INDEX IF NOT EXISTS idx_tindakan_kode ON tindakan_medis(kode_tindakan);
CREATE INDEX IF NOT EXISTS idx_tindakan_user_buat ON tindakan_medis(metadata_user_buat);

-- Create indexes for terapi_obat
CREATE INDEX IF NOT EXISTS idx_terapi_plan ON terapi_obat(id_plan);
CREATE INDEX IF NOT EXISTS idx_terapi_nama_obat ON terapi_obat(nama_obat);
CREATE INDEX IF NOT EXISTS idx_terapi_user_buat ON terapi_obat(metadata_user_buat);

-- Triggers to auto-update updated_at
CREATE TRIGGER update_soap_plan_updated_at
  BEFORE UPDATE ON soap_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tindakan_medis_updated_at
  BEFORE UPDATE ON tindakan_medis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terapi_obat_updated_at
  BEFORE UPDATE ON terapi_obat
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
