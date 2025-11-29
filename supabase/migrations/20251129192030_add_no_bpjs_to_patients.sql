/*
  # Add No BPJS field to Patients

  1. Changes
    - Add `no_bpjs` column to `identitas_pasien` table for BPJS number
    - Field is optional (nullable)
    - Can be used for searching patients in APM system

  2. Notes
    - This allows patients to be searched by BPJS number
    - Used in APM (Alat Pendaftaran Mandiri) system
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'identitas_pasien' AND column_name = 'no_bpjs'
  ) THEN
    ALTER TABLE identitas_pasien ADD COLUMN no_bpjs text;
  END IF;
END $$;
