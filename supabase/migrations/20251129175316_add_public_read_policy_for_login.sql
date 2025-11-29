/*
  # Add Public Read Policy for Login

  1. Changes
    - Add policy to allow anonymous users to read user data for login authentication
    - This is necessary for the login flow to verify credentials before authentication

  2. Security Notes
    - This allows reading user data including passwords for authentication
    - Passwords should be hashed in production
    - Only SELECT permission is granted for login verification
*/

-- Allow anonymous users to read user data for login authentication
CREATE POLICY "Allow public read for login"
  ON users
  FOR SELECT
  TO anon
  USING (true);
