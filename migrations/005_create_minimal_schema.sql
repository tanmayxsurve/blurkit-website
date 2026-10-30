-- BlurKit Database - Minimal Schema (Dodo Payments Integration)
-- This creates only the essential tables needed after moving to Dodo
-- Created: 2026-10-30

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

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'webhook_events')
ORDER BY tablename;
