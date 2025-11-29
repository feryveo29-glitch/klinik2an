/*
  # Fix RLS Policies for registrasi_kunjungan table

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow anonymous and authenticated access
    - Allow SELECT for all users (for viewing registrations)
    - Allow INSERT for anonymous users (for APM kiosk)
    - Allow UPDATE/DELETE for authenticated users only

  2. Security
    - Public can view registrations (needed for display)
    - Public can create registrations (needed for APM)
    - Only authenticated users can update/delete
*/

DROP POLICY IF EXISTS "Allow anonymous to read registrations" ON registrasi_kunjungan;
DROP POLICY IF EXISTS "Allow authenticated to read registrations" ON registrasi_kunjungan;
DROP POLICY IF EXISTS "Allow anonymous to insert registrations" ON registrasi_kunjungan;
DROP POLICY IF EXISTS "Allow authenticated to insert registrations" ON registrasi_kunjungan;
DROP POLICY IF EXISTS "Allow authenticated to update registrations" ON registrasi_kunjungan;
DROP POLICY IF EXISTS "Allow authenticated to delete registrations" ON registrasi_kunjungan;

CREATE POLICY "Allow all to read registrations"
  ON registrasi_kunjungan
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all to insert registrations"
  ON registrasi_kunjungan
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update registrations"
  ON registrasi_kunjungan
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete registrations"
  ON registrasi_kunjungan
  FOR DELETE
  TO authenticated
  USING (true);
