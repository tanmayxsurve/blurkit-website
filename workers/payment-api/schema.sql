-- BlurKit Licenses Table
-- Run this SQL on your Neon database

-- Main licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  license_key VARCHAR(255) NOT NULL UNIQUE,
  plan_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_session_id ON licenses(session_id);

-- Optional: Add a table for tracking license validations
CREATE TABLE IF NOT EXISTS license_validations (
  id SERIAL PRIMARY KEY,
  license_key VARCHAR(255) NOT NULL,
  validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent VARCHAR(500),
  ip_address VARCHAR(45)
);

CREATE INDEX IF NOT EXISTS idx_validation_license_key ON license_validations(license_key);
CREATE INDEX IF NOT EXISTS idx_validated_at ON license_validations(validated_at);
