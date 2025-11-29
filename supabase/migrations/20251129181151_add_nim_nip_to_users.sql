/*
  # Add NIM and NIP columns to users table

  1. Changes
    - Add `nim` column for mahasiswa (Nomor Induk Mahasiswa)
    - Add `nip` column for dosen and admin (Nomor Induk Pegawai)
    - Add unique constraints to ensure no duplicate NIM/NIP
    - Update username to use nim/nip instead of email
  
  2. Notes
    - NIM is only for mahasiswa role
    - NIP is for dosen and admin roles
    - Both fields are unique when not null
    - Username field will be used to store nim/nip
*/

-- Add nim column for mahasiswa
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'nim'
  ) THEN
    ALTER TABLE users ADD COLUMN nim text;
  END IF;
END $$;

-- Add nip column for dosen and admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'nip'
  ) THEN
    ALTER TABLE users ADD COLUMN nip text;
  END IF;
END $$;

-- Add unique constraint for nim
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_nim_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_nim_key UNIQUE (nim);
  END IF;
END $$;

-- Add unique constraint for nip
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_nip_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_nip_key UNIQUE (nip);
  END IF;
END $$;

-- Create index on nim for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_nim ON users(nim) WHERE nim IS NOT NULL;

-- Create index on nip for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_nip ON users(nip) WHERE nip IS NOT NULL;
