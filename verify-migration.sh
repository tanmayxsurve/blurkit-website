#!/bin/bash

# BlurKit Database Verification Script
# Verifies that the device_registrations migration was applied correctly

echo "=== BlurKit Database Verification ==="
echo ""

if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  echo "Please set DATABASE_URL and try again:"
  echo "  export DATABASE_URL='postgresql://...'"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Check if device_registrations table exists
echo "Checking device_registrations table..."
psql "$DATABASE_URL" -t -c "
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'device_registrations'
) AS table_exists;" > /tmp/table_check.txt

TABLE_EXISTS=$(cat /tmp/table_check.txt | tr -d ' ')

if [ "$TABLE_EXISTS" = "t" ]; then
  echo "✅ device_registrations table EXISTS"
else
  echo "❌ device_registrations table DOES NOT EXIST"
  exit 1
fi

echo ""

# Check columns in device_registrations
echo "Checking device_registrations columns..."
psql "$DATABASE_URL" -c "
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'device_registrations'
ORDER BY ordinal_position;"

echo ""

# Check if active_browser_instance_id column exists in licenses
echo "Checking licenses table updates..."
psql "$DATABASE_URL" -t -c "
SELECT EXISTS (
  SELECT FROM information_schema.columns
  WHERE table_name = 'licenses'
  AND column_name = 'active_browser_instance_id'
) AS column_exists;" > /tmp/column_check.txt

COLUMN_EXISTS=$(cat /tmp/column_check.txt | tr -d ' ')

if [ "$COLUMN_EXISTS" = "t" ]; then
  echo "✅ active_browser_instance_id column EXISTS in licenses"
else
  echo "⚠️  active_browser_instance_id column DOES NOT EXIST (optional)"
fi

echo ""

# Check indexes
echo "Checking device_registrations indexes..."
psql "$DATABASE_URL" -c "
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'device_registrations'
ORDER BY indexname;"

echo ""

# Check trigger
echo "Checking device_registrations trigger..."
psql "$DATABASE_URL" -c "
SELECT trigger_name, trigger_schema, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'device_registrations';"

echo ""
echo "=== Verification Complete ==="
echo ""
echo "✅ Migration appears to be applied successfully!"
