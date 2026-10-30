-- Remove Legacy License Tables
-- Dodo Payments now handles all license management
-- This migration removes custom license infrastructure
-- Date: 2026-10-30

-- =====================================================
-- DROP TRIGGERS (must be dropped before tables)
-- =====================================================
DROP TRIGGER IF EXISTS update_licenses_updated_at ON licenses;

-- =====================================================
-- DROP TABLES
-- The licenses table is no longer needed since Dodo
-- manages license keys directly
-- =====================================================
DROP TABLE IF EXISTS licenses CASCADE;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Remaining tables after migration:
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'webhook_events')
ORDER BY tablename;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. The 'orders' table is kept to track payment history
-- 2. The 'webhook_events' table is kept for idempotency
-- 3. License keys are now managed by Dodo Payments API
-- 4. Extension validates directly against Dodo's public API
-- 5. No local license storage in custom tables needed
