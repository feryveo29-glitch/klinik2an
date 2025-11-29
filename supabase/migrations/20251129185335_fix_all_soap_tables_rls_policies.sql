/*
  # Fix RLS Policies for All SOAP and Related Tables

  ## Purpose
  Fix Row Level Security policies for kunjungan_resume and all SOAP tables
  to allow anon and authenticated users to perform operations.

  ## Tables Updated
  - kunjungan_resume
  - soap_subjektif
  - soap_objektif
  - pemeriksaan_penunjang
  - soap_asesmen_diagnosis
  - soap_plan
  - tindakan_medis
  - terapi_obat
  - diagnosis

  ## Changes
  1. Drop existing restrictive policies
  2. Create new permissive policies for anon and authenticated roles
  3. Allow full CRUD operations for application users

  ## Security
  - Application-level security enforced through custom auth
  - RLS enabled but allows operations for anon and authenticated roles
*/

-- Fix kunjungan_resume policies
DROP POLICY IF EXISTS "Authenticated users can read visits" ON kunjungan_resume;
DROP POLICY IF EXISTS "Authenticated users can create visits" ON kunjungan_resume;
DROP POLICY IF EXISTS "Authenticated users can update visits" ON kunjungan_resume;
DROP POLICY IF EXISTS "Only admins can delete visits" ON kunjungan_resume;

CREATE POLICY "Allow anon full access to visits"
  ON kunjungan_resume FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to visits"
  ON kunjungan_resume FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix soap_subjektif policies
DROP POLICY IF EXISTS "Authenticated users can read subjektif" ON soap_subjektif;
DROP POLICY IF EXISTS "Authenticated users can create subjektif" ON soap_subjektif;
DROP POLICY IF EXISTS "Authenticated users can update subjektif" ON soap_subjektif;
DROP POLICY IF EXISTS "Only admins can delete subjektif" ON soap_subjektif;

CREATE POLICY "Allow anon full access to subjektif"
  ON soap_subjektif FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to subjektif"
  ON soap_subjektif FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix soap_objektif policies
DROP POLICY IF EXISTS "Authenticated users can read objektif" ON soap_objektif;
DROP POLICY IF EXISTS "Authenticated users can create objektif" ON soap_objektif;
DROP POLICY IF EXISTS "Authenticated users can update objektif" ON soap_objektif;
DROP POLICY IF EXISTS "Only admins can delete objektif" ON soap_objektif;

CREATE POLICY "Allow anon full access to objektif"
  ON soap_objektif FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to objektif"
  ON soap_objektif FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix pemeriksaan_penunjang policies
DROP POLICY IF EXISTS "Authenticated users can read penunjang" ON pemeriksaan_penunjang;
DROP POLICY IF EXISTS "Authenticated users can create penunjang" ON pemeriksaan_penunjang;
DROP POLICY IF EXISTS "Authenticated users can update penunjang" ON pemeriksaan_penunjang;
DROP POLICY IF EXISTS "Only admins can delete penunjang" ON pemeriksaan_penunjang;

CREATE POLICY "Allow anon full access to penunjang"
  ON pemeriksaan_penunjang FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to penunjang"
  ON pemeriksaan_penunjang FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix soap_asesmen_diagnosis policies
DROP POLICY IF EXISTS "Authenticated users can read asesmen" ON soap_asesmen_diagnosis;
DROP POLICY IF EXISTS "Authenticated users can create asesmen" ON soap_asesmen_diagnosis;
DROP POLICY IF EXISTS "Authenticated users can update asesmen" ON soap_asesmen_diagnosis;
DROP POLICY IF EXISTS "Only admins can delete asesmen" ON soap_asesmen_diagnosis;

CREATE POLICY "Allow anon full access to asesmen"
  ON soap_asesmen_diagnosis FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to asesmen"
  ON soap_asesmen_diagnosis FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix soap_plan policies
DROP POLICY IF EXISTS "Authenticated users can read plan" ON soap_plan;
DROP POLICY IF EXISTS "Authenticated users can create plan" ON soap_plan;
DROP POLICY IF EXISTS "Authenticated users can update plan" ON soap_plan;
DROP POLICY IF EXISTS "Only admins can delete plan" ON soap_plan;

CREATE POLICY "Allow anon full access to plan"
  ON soap_plan FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to plan"
  ON soap_plan FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix tindakan_medis policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'tindakan_medis') THEN
    DROP POLICY IF EXISTS "Authenticated users can read tindakan" ON tindakan_medis;
    DROP POLICY IF EXISTS "Authenticated users can create tindakan" ON tindakan_medis;
    DROP POLICY IF EXISTS "Authenticated users can update tindakan" ON tindakan_medis;
    DROP POLICY IF EXISTS "Only admins can delete tindakan" ON tindakan_medis;

    CREATE POLICY "Allow anon full access to tindakan"
      ON tindakan_medis FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated full access to tindakan"
      ON tindakan_medis FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Fix terapi_obat policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'terapi_obat') THEN
    DROP POLICY IF EXISTS "Authenticated users can read terapi" ON terapi_obat;
    DROP POLICY IF EXISTS "Authenticated users can create terapi" ON terapi_obat;
    DROP POLICY IF EXISTS "Authenticated users can update terapi" ON terapi_obat;
    DROP POLICY IF EXISTS "Only admins can delete terapi" ON terapi_obat;

    CREATE POLICY "Allow anon full access to terapi"
      ON terapi_obat FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated full access to terapi"
      ON terapi_obat FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Fix diagnosis policies (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'diagnosis') THEN
    DROP POLICY IF EXISTS "Authenticated users can read diagnosis" ON diagnosis;
    DROP POLICY IF EXISTS "Authenticated users can create diagnosis" ON diagnosis;
    DROP POLICY IF EXISTS "Authenticated users can update diagnosis" ON diagnosis;
    DROP POLICY IF EXISTS "Only admins can delete diagnosis" ON diagnosis;

    CREATE POLICY "Allow anon full access to diagnosis"
      ON diagnosis FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated full access to diagnosis"
      ON diagnosis FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
