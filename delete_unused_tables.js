import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('Deleting unused tables...\n')
  
  // Drop orders table
  console.log('Dropping orders table...')
  await client.query('DROP TABLE IF EXISTS orders CASCADE')
  console.log('✅ orders table deleted\n')
  
  // Drop webhook_events table
  console.log('Dropping webhook_events table...')
  await client.query('DROP TABLE IF EXISTS webhook_events CASCADE')
  console.log('✅ webhook_events table deleted\n')
  
  // Verify remaining tables
  console.log('Remaining tables:')
  const result = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)
  
  result.rows.forEach(row => {
    console.log(`  - ${row.table_name}`)
  })
  
  console.log('\n✨ Database cleanup complete!')
  
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
