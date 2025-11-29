/*
  # Create Database Size Function
  
  1. New Functions
    - `get_database_size()` - Returns human-readable database size
  
  2. Purpose
    - Provide real-time database storage information
    - Used for dashboard statistics display
*/

-- Create function to get database size
CREATE OR REPLACE FUNCTION get_database_size()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN pg_size_pretty(pg_database_size(current_database()));
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_database_size() TO anon;
GRANT EXECUTE ON FUNCTION get_database_size() TO authenticated;
