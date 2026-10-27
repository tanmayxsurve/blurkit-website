/**
 * Database Migration Runner
 * Executes SQL migration files against Neon PostgreSQL database
 */

import { Pool } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

// Load .env file
dotenv.config()

async function runMigration() {
  console.log('🚀 Starting database migration...\n')

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env file')
    process.exit(1)
  }

  console.log('📦 Connecting to Neon database...')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()')
    console.log('✅ Connected to database at:', testResult.rows[0].now)
    console.log('')

    // Run only table creation statements (skip functions and triggers for now)
    console.log('📄 Creating tables...')

    // Create orders table
    await pool.query(`
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
      )
    `)
    console.log('  ✓ orders table created')

    // Create indexes for orders
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(dodo_session_id)`)
    console.log('  ✓ orders indexes created')

    // Create licenses table
    await pool.query(`
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
      )
    `)
    console.log('  ✓ licenses table created')

    // Create indexes for licenses
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_licenses_device_id ON licenses(device_id)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_licenses_key_device ON licenses(key, device_id)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_licenses_expires ON licenses(expires_at) WHERE expires_at IS NOT NULL`)
    console.log('  ✓ licenses indexes created')

    // Create webhook_events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS webhook_events (
        id SERIAL PRIMARY KEY,
        event_id VARCHAR(255) UNIQUE NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        payload JSONB,
        processed BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('  ✓ webhook_events table created')

    // Create indexes for webhook_events
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed) WHERE processed = FALSE`)
    console.log('  ✓ webhook_events indexes created')

    console.log('✅ All tables and indexes created')
    console.log('')

    // Verify tables exist
    console.log('🔍 Verifying tables...')
    const tablesResult = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)

    console.log('Tables created:')
    tablesResult.rows.forEach((row: any) => {
      console.log(`  ✓ ${row.tablename}`)
    })
    console.log('')

    // Get row counts
    console.log('📊 Table status:')
    for (const row of tablesResult.rows as any[]) {
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${row.tablename}`)
      console.log(`  ${row.tablename}: ${countResult.rows[0].count} rows`)
    }
    console.log('')

    // Get column info for licenses table
    console.log('📋 Licenses table columns:')
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'licenses'
      ORDER BY ordinal_position
    `)
    columnsResult.rows.forEach((row: any) => {
      const nullable = row.is_nullable === 'YES' ? '(nullable)' : '(required)'
      console.log(`  - ${row.column_name}: ${row.data_type} ${nullable}`)
    })
    console.log('')

    console.log('🎉 Database initialization completed successfully!')
    console.log('')
    console.log('✅ All tables created and ready to use')
    console.log('')
    console.log('Next steps:')
    console.log('1. Set up Dodo Payments credentials in .env')
    console.log('2. Set up Resend API key in .env')
    console.log('3. Run: npm run dev')
    console.log('4. Test the application at http://localhost:3000')

  } catch (error) {
    console.error('❌ Migration failed:')
    if (error instanceof Error) {
      console.error('Message:', error.message)
      if (error.message.includes('already exists')) {
        console.log('\n(Tables already exist - this is OK)')
      } else {
        console.error('Stack:', error.stack)
      }
    } else {
      console.error(error)
    }

    // Try to continue if tables already exist
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('\n✅ Tables appear to already exist - continuing...')
    } else {
      process.exit(1)
    }
  } finally {
    await pool.end()
  }
}

runMigration()
