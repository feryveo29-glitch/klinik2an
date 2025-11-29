/*
  # Create Queue Numbers Table for APM System

  1. New Tables
    - `queue_numbers`
      - `id` (uuid, primary key) - Unique identifier
      - `queue_date` (date) - Date of the queue
      - `queue_type` (text) - Type: 'A' for new patients, 'B' for returning patients
      - `queue_number` (integer) - Sequential number for the day
      - `full_queue_code` (text) - Full code like 'A001', 'B023'
      - `patient_id` (uuid, nullable) - Reference to patient if returning patient
      - `status` (text) - Status: 'waiting', 'called', 'completed', 'cancelled'
      - `created_at` (timestamptz) - When queue was created
      - `called_at` (timestamptz, nullable) - When queue was called
      - `completed_at` (timestamptz, nullable) - When service completed

  2. Security
    - Enable RLS on `queue_numbers` table
    - Add policy for anonymous users to insert (for APM kiosk)
    - Add policy for authenticated users to read all
    - Add policy for authenticated users to update status

  3. Indexes
    - Index on queue_date and queue_type for fast lookups
    - Index on status for filtering active queues

  4. Important Notes
    - Queue numbers reset daily automatically
    - Counter A for new patient registration
    - Counter B for returning patient registration
*/

CREATE TABLE IF NOT EXISTS queue_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_date date NOT NULL DEFAULT CURRENT_DATE,
  queue_type text NOT NULL CHECK (queue_type IN ('A', 'B')),
  queue_number integer NOT NULL,
  full_queue_code text NOT NULL,
  patient_id uuid,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  called_at timestamptz,
  completed_at timestamptz,
  CONSTRAINT fk_queue_patient FOREIGN KEY (patient_id) REFERENCES identitas_pasien(id_pasien) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_queue_date_type ON queue_numbers(queue_date, queue_type);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue_numbers(status);
CREATE INDEX IF NOT EXISTS idx_queue_created ON queue_numbers(created_at DESC);

ALTER TABLE queue_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous to insert queue numbers"
  ON queue_numbers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow all to read queue numbers"
  ON queue_numbers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated to update queue status"
  ON queue_numbers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION get_next_queue_number(p_queue_type text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_next_number integer;
  v_queue_code text;
BEGIN
  SELECT COALESCE(MAX(queue_number), 0) + 1
  INTO v_next_number
  FROM queue_numbers
  WHERE queue_date = CURRENT_DATE
    AND queue_type = p_queue_type;
  
  v_queue_code := p_queue_type || LPAD(v_next_number::text, 3, '0');
  
  RETURN v_queue_code;
END;
$$;
