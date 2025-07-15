/*
  # Add Case Management Tables

  1. New Tables
    - `featured_cases` - Stores featured case studies
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `company_name` (text, required)
      - `industry` (text, required)
      - `description` (text, required)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `partner_cases` - Stores partner customer cases
      - `id` (uuid, primary key)
      - `company_name` (text, required)
      - `logo_url` (text, optional)
      - `industry` (text, required)
      - `description` (text, required)
      - `results` (text, required)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage cases
    - Add policies for public to view active cases
*/

-- Create featured_cases table
CREATE TABLE IF NOT EXISTS featured_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_name text NOT NULL,
  industry text NOT NULL,
  description text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create partner_cases table
CREATE TABLE IF NOT EXISTS partner_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  logo_url text,
  industry text NOT NULL,
  description text NOT NULL,
  results text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE featured_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_cases ENABLE ROW LEVEL SECURITY;

-- Create policies for featured_cases
CREATE POLICY "Anyone can view active featured cases" 
  ON featured_cases
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage featured cases" 
  ON featured_cases
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for partner_cases
CREATE POLICY "Anyone can view active partner cases" 
  ON partner_cases
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage partner cases" 
  ON partner_cases
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_featured_cases_updated_at
BEFORE UPDATE ON featured_cases
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_partner_cases_updated_at
BEFORE UPDATE ON partner_cases
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for better performance
CREATE INDEX idx_featured_cases_is_active ON featured_cases(is_active);
CREATE INDEX idx_featured_cases_sort_order ON featured_cases(sort_order);
CREATE INDEX idx_partner_cases_is_active ON partner_cases(is_active);
CREATE INDEX idx_partner_cases_sort_order ON partner_cases(sort_order);
CREATE INDEX idx_partner_cases_industry ON partner_cases(industry);