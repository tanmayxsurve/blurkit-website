-- Migration: Add device binding columns to licenses table
-- Run this SQL in your Neon PostgreSQL database

-- Add device_id column (stores device fingerprint hash)
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS device_id VARCHAR(64);

-- Add activated_at column (timestamp when license was first activated)
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP;

-- Add last_validated_at column (timestamp of last validation check)
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP;

-- Add index on device_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_licenses_device_id ON licenses(device_id);

-- Add index on license key + device_id for validation queries
CREATE INDEX IF NOT EXISTS idx_licenses_key_device ON licenses(key, device_id);

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'licenses'
ORDER BY ordinal_position;
