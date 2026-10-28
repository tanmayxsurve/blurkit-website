#!/usr/bin/env node
/**
 * Database Migration Runner
 * Executes SQL migration files against Neon PostgreSQL database
 */

import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  console.log('📦 Connecting to Neon database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database at:', testResult.rows[0].now);
    console.log('');

    // Run 000_initial_schema.sql
    console.log('📄 Running: 000_initial_schema.sql');
    const initialSchema = readFileSync(
      join(__dirname, '../migrations/000_initial_schema.sql'),
      'utf-8'
    );
    await pool.query(initialSchema);
    console.log('✅ Initial schema created successfully');
    console.log('');

    // Run 001_add_device_binding.sql
    console.log('📄 Running: 001_add_device_binding.sql');
    const deviceBinding = readFileSync(
      join(__dirname, '../migrations/001_add_device_binding.sql'),
      'utf-8'
    );
    await pool.query(deviceBinding);
    console.log('✅ Device binding migration completed');
    console.log('');

    // Verify tables exist
    console.log('🔍 Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log('Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.tablename}`);
    });
    console.log('');

    // Get row counts
    console.log('📊 Table status:');
    for (const row of tablesResult.rows) {
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${row.tablename}`);
      console.log(`  ${row.tablename}: ${countResult.rows[0].count} rows`);
    }
    console.log('');

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Set up Dodo Payments credentials in .env');
    console.log('2. Set up Resend API key in .env');
    console.log('3. Run: npm run dev');
    console.log('4. Test the application');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
