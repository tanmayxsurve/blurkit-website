import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('=== Database Tables ===\n')
  
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)
  
  console.log('Available tables:')
  tablesResult.rows.forEach(row => {
    console.log(`  - ${row.table_name}`)
  })
  
  console.log('\n=== Checking required tables for Next.js webhook ===')
  
  const requiredTables = ['orders', 'webhook_events', 'licenses']
  
  for (const table of requiredTables) {
    const exists = tablesResult.rows.some(row => row.table_name === table)
    console.log(`${exists ? '✅' : '❌'} ${table}`)
  }
  
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
