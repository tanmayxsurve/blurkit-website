// BlurKit Database Verification Script
// Verifies that the device_registrations migration was applied correctly

import { Client } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

async function verifyMigration() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('=== BlurKit Database Verification ===\n');
    console.log('✅ Connected to database\n');

    // Check if device_registrations table exists
    console.log('Checking device_registrations table...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'device_registrations'
      ) AS table_exists
    `);

    if (tableCheck.rows[0].table_exists) {
      console.log('✅ device_registrations table EXISTS\n');
    } else {
      console.log('❌ device_registrations table DOES NOT EXIST\n');
      await client.end();
      process.exit(1);
    }

    // Check columns in device_registrations
    console.log('Checking device_registrations columns...');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'device_registrations'
      ORDER BY ordinal_position
    `);

    console.table(columns.rows);
    console.log('');

    // Check if active_browser_instance_id column exists in licenses
    console.log('Checking licenses table updates...');
    const columnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'licenses'
        AND column_name = 'active_browser_instance_id'
      ) AS column_exists
    `);

    if (columnCheck.rows[0].column_exists) {
      console.log('✅ active_browser_instance_id column EXISTS in licenses\n');
    } else {
      console.log('⚠️  active_browser_instance_id column DOES NOT EXIST (optional)\n');
    }

    // Check indexes
    console.log('Checking device_registrations indexes...');
    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'device_registrations'
      ORDER BY indexname
    `);

    console.table(indexes.rows);
    console.log('');

    // Check trigger
    console.log('Checking device_registrations trigger...');
    const triggers = await client.query(`
      SELECT trigger_name, event_manipulation, event_object_table
      FROM information_schema.triggers
      WHERE event_object_table = 'device_registrations'
    `);

    if (triggers.rows.length > 0) {
      console.table(triggers.rows);
      console.log('');
    } else {
      console.log('⚠️  No triggers found on device_registrations (optional)\n');
    }

    // Count existing registrations (should be 0 for new migration)
    console.log('Checking existing device_registrations...');
    const count = await client.query(`
      SELECT COUNT(*) as count FROM device_registrations
    `);
    console.log(`📊 Current device_registrations count: ${count.rows[0].count}\n`);

    // Check licenses table structure
    console.log('Checking licenses table columns...');
    const licenseColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'licenses'
      ORDER BY ordinal_position
    `);
    console.table(licenseColumns.rows);

    await client.end();
    console.log('\n=== Verification Complete ===');
    console.log('✅ Migration appears to be applied successfully!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    await client.end();
    process.exit(1);
  }
}

verifyMigration();
