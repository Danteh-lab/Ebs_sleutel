/*
  # Complete EBS Key Management Database Schema

  1. New Tables
    - `employees` - Employee information with CAO/MBV types
    - `keys` - Key management with types A/B/C and kort/lang lengths  
    - `transactions` - Complete transaction history for key issue/return

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access patterns

  3. Features
    - Automatic years of service calculation
    - Key status tracking
    - Transaction logging with notes
    - Foreign key relationships
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  employee_number text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('CAO', 'MBV')),
  start_date date NOT NULL,
  years_of_service integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create keys table
CREATE TABLE IF NOT EXISTS keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_number text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('A', 'B', 'C')),
  length text NOT NULL CHECK (length IN ('kort', 'lang')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'issued')),
  assigned_to uuid REFERENCES employees(id) ON DELETE SET NULL,
  opmerking text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  key_id uuid NOT NULL REFERENCES keys(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('issue', 'return')),
  timestamp timestamptz DEFAULT now(),
  notes text,
  handled_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for employees
CREATE POLICY "Authenticated users can read employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for keys
CREATE POLICY "Authenticated users can read keys"
  ON keys FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert keys"
  ON keys FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update keys"
  ON keys FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete keys"
  ON keys FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for transactions
CREATE POLICY "Authenticated users can read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_keys_key_number ON keys(key_number);
CREATE INDEX IF NOT EXISTS idx_keys_status ON keys(status);
CREATE INDEX IF NOT EXISTS idx_keys_assigned_to ON keys(assigned_to);
CREATE INDEX IF NOT EXISTS idx_transactions_employee_id ON transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_key_id ON transactions(key_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);

-- Create function to update years of service
CREATE OR REPLACE FUNCTION update_years_of_service()
RETURNS TRIGGER AS $$
BEGIN
  NEW.years_of_service = EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.start_date));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update years of service
DROP TRIGGER IF EXISTS trigger_update_years_of_service ON employees;
CREATE TRIGGER trigger_update_years_of_service
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_years_of_service();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for keys
DROP TRIGGER IF EXISTS trigger_update_keys_updated_at ON keys;
CREATE TRIGGER trigger_update_keys_updated_at
  BEFORE UPDATE ON keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO employees (name, employee_number, type, start_date) VALUES
  ('Jan de Vries', 'EMP001', 'CAO', '2020-01-15'),
  ('Maria Jansen', 'EMP002', 'MBV', '2019-03-20'),
  ('Piet Bakker', 'EMP003', 'CAO', '2021-06-10')
ON CONFLICT (employee_number) DO NOTHING;

INSERT INTO keys (key_number, type, length, opmerking) VALUES
  ('A001', 'A', 'kort', 'Hoofdingang sleutel'),
  ('A002', 'A', 'lang', 'Kantoor sleutel'),
  ('B001', 'B', 'kort', 'Magazijn sleutel'),
  ('B002', 'B', 'lang', 'Werkplaats sleutel'),
  ('C001', 'C', 'kort', 'Kluis sleutel')
ON CONFLICT (key_number) DO NOTHING;