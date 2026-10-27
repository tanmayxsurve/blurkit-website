-- BlurKit Database - Initial Schema
-- Run this FIRST in your Neon PostgreSQL console before running any other migrations
-- Database: blurkit
-- Created: 2026-10-27

-- =====================================================
-- TABLE: orders
-- Stores payment order records from Dodo Payments
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  dodo_session_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  plan_id VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index for session lookups (webhook processing)
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(dodo_session_id);

-- =====================================================
-- TABLE: licenses
-- Stores license keys and device binding information
-- =====================================================
CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  key VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  device_id VARCHAR(64),
  activated_at TIMESTAMP,
  last_validated_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for license key lookups (most critical query)
CREATE UNIQUE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);

-- Index for email lookups (customer support)
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);

-- Index for device_id lookups (validation checks)
CREATE INDEX IF NOT EXISTS idx_licenses_device_id ON licenses(device_id);

-- Composite index for validation queries (key + device)
CREATE INDEX IF NOT EXISTS idx_licenses_key_device ON licenses(key, device_id);

-- Index for status filtering (active licenses)
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);

-- Index for expiration checks
CREATE INDEX IF NOT EXISTS idx_licenses_expires ON licenses(expires_at) WHERE expires_at IS NOT NULL;

-- =====================================================
-- TABLE: webhook_events
-- Prevents duplicate webhook processing (idempotency)
-- =====================================================
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for event_id lookups (idempotency checks)
CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

-- Index for event type filtering
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);

-- Index for unprocessed events
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed) WHERE processed = FALSE;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- Automatically update updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for licenses table
CREATE TRIGGER update_licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION
-- Check that all tables and indexes were created
-- =====================================================
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'licenses', 'webhook_events')
ORDER BY tablename;

-- List all indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'licenses', 'webhook_events')
ORDER BY tablename, indexname;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run this script FIRST before running 001_add_device_binding.sql
-- 2. After running this, verify all 3 tables exist
-- 3. The device binding migration (001) adds columns that are already here
-- 4. Foreign key constraint: licenses.order_id references orders.id
-- 5. All timestamps are in UTC
-- 6. Status values: 'pending', 'completed', 'failed', 'refunded' (orders)
-- 7. Status values: 'active', 'suspended', 'expired', 'revoked' (licenses)
-- 8. License key format: BLURKIT-XXXX-XXXX-XXXX-XXXX (30 chars with dashes)
