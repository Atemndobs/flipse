-- Update visitors table
ALTER TABLE visitors
ADD COLUMN country TEXT,
ADD COLUMN country_code TEXT;

-- Update waitlist table
ALTER TABLE waitlist
ADD COLUMN country TEXT,
ADD COLUMN country_code TEXT;

-- Create indexes for better performance
CREATE INDEX idx_visitors_country ON visitors(country);
CREATE INDEX idx_waitlist_country ON waitlist(country);