-- Create partner_cases table
CREATE TABLE IF NOT EXISTS partner_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    industry VARCHAR(100) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    logo_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_partner_cases_company_name ON partner_cases(company_name);
CREATE INDEX IF NOT EXISTS idx_partner_cases_industry ON partner_cases(industry);

-- Add trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partner_cases_updated_at
    BEFORE UPDATE ON partner_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 