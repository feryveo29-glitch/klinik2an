/*
  # Create Patient Identity Table (Identitas Pasien)

  ## Purpose
  Core patient identity and demographic information table for the Medical Record System.

  ## Tables Created
  
  ### `identitas_pasien`
  Stores complete patient demographic and contact information.
  
  **Columns:**
  - `id_pasien` (uuid, primary key) - Unique patient identifier
  - `nik` (text, not null) - National Identity Number (Nomor Induk Kependudukan)
  - `no_rm` (text, unique, not null) - Medical Record Number
  - `nama_lengkap` (text, not null) - Patient's full name
  - `tgl_lahir` (date, not null) - Date of birth
  - `jenis_kelamin` (text, not null) - Gender
  - `pekerjaan` (text) - Occupation
  - `pendidikan` (text) - Education level
  - `alamat` (text) - Full address
  - `status_kawin` (text) - Marital status
  - `no_hp` (text) - Phone number
  
  **Metadata Columns:**
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `metadata_user_buat` (uuid, nullable, FK to users) - User who created the record
  - `metadata_user_ubah` (uuid, nullable, FK to users) - User who last updated the record

  ## Security
  - Row Level Security (RLS) enabled
  - Authenticated users can read all patient data
  - Only authenticated users can create patient records
  - Only authenticated users can update patient records
  - Deletion restricted to admins only

  ## Constraints
  - `no_rm` must be unique across all patients
  - Foreign key relationships to `users` table for audit trail

  ## Notes
  - All demographic fields follow Indonesian healthcare standards
  - Audit trail maintained through metadata columns
  - Timestamps auto-update on modification
*/

-- Create identitas_pasien table
CREATE TABLE IF NOT EXISTS identitas_pasien (
  id_pasien uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nik text NOT NULL,
  no_rm text UNIQUE NOT NULL,
  nama_lengkap text NOT NULL,
  tgl_lahir date NOT NULL,
  jenis_kelamin text NOT NULL,
  pekerjaan text,
  pendidikan text,
  alamat text,
  status_kawin text,
  no_hp text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata_user_buat uuid,
  metadata_user_ubah uuid,
  CONSTRAINT fk_user_buat FOREIGN KEY (metadata_user_buat) REFERENCES users(id),
  CONSTRAINT fk_user_ubah FOREIGN KEY (metadata_user_ubah) REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE identitas_pasien ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all patient data
CREATE POLICY "Authenticated users can read patients"
  ON identitas_pasien
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create patient records
CREATE POLICY "Authenticated users can create patients"
  ON identitas_pasien
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Policy: Authenticated users can update patient records
CREATE POLICY "Authenticated users can update patients"
  ON identitas_pasien
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only admins can delete patient records
CREATE POLICY "Only admins can delete patients"
  ON identitas_pasien
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_identitas_pasien_nik ON identitas_pasien(nik);
CREATE INDEX IF NOT EXISTS idx_identitas_pasien_no_rm ON identitas_pasien(no_rm);
CREATE INDEX IF NOT EXISTS idx_identitas_pasien_nama ON identitas_pasien(nama_lengkap);
CREATE INDEX IF NOT EXISTS idx_identitas_pasien_metadata_user_buat ON identitas_pasien(metadata_user_buat);
CREATE INDEX IF NOT EXISTS idx_identitas_pasien_metadata_user_ubah ON identitas_pasien(metadata_user_ubah);

-- Trigger to auto-update updated_at for identitas_pasien
CREATE TRIGGER update_identitas_pasien_updated_at
  BEFORE UPDATE ON identitas_pasien
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
