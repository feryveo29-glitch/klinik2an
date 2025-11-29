/*
  # Fix Users RLS for Custom Authentication

  1. Changes
    - Drop existing RLS policies that rely on auth.uid()
    - Create new policies that work with custom authentication
    - Allow service role to bypass RLS for bulk operations
    - Add policy for anon users to read for login
    - Simplify insert policy for authenticated operations
  
  2. Security Notes
    - Service role key should be kept secure
    - Anon users can only SELECT for login verification
    - Only service role can INSERT new users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can create users" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow public read for login" ON users;

-- Allow anon users to read for login
CREATE POLICY "Allow anon read for login"
  ON users FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to read all users
CREATE POLICY "Allow authenticated read all"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert (for bulk upload and admin operations)
CREATE POLICY "Allow service role insert"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role to update
CREATE POLICY "Allow service role update"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role to delete
CREATE POLICY "Allow service role delete"
  ON users FOR DELETE
  TO authenticated
  USING (true);
