-- BlurKit Licenses Table
-- Run this SQL on your Neon database

CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  license_key VARCHAR(255) NOT NULL UNIQUE,
  plan_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_license_key (license_key),
  INDEX idx_session_id (session_id)
);

-- Optional: Add a table for tracking license validations
CREATE TABLE IF NOT EXISTS license_validations (
  id SERIAL PRIMARY KEY,
  license_key VARCHAR(255) NOT NULL,
  validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),
  FOREIGN KEY (license_key) REFERENCES licenses(license_key) ON DELETE CASCADE,
  INDEX idx_license_key (license_key)
);
