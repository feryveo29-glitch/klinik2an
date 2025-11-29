/*
  # Fix RLS Policies for identitas_pasien Table

  ## Purpose
  Fix Row Level Security policies to allow anon and authenticated users
  to perform operations on identitas_pasien table, as this system uses
  custom authentication (not Supabase Auth).

  ## Changes
  1. Drop existing restrictive policies
  2. Create new permissive policies for anon and authenticated roles
  3. Allow full CRUD operations for application users

  ## Security
  - Application-level security is enforced through custom auth
  - RLS is enabled but allows operations for anon and authenticated roles
  - Admin-only delete restriction is removed (handled at application level)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read patients" ON identitas_pasien;
DROP POLICY IF EXISTS "Authenticated users can create patients" ON identitas_pasien;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON identitas_pasien;
DROP POLICY IF EXISTS "Only admins can delete patients" ON identitas_pasien;

-- Create new permissive policies for anon users
CREATE POLICY "Allow anon full access to patients"
  ON identitas_pasien FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create new permissive policies for authenticated users
CREATE POLICY "Allow authenticated full access to patients"
  ON identitas_pasien FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
