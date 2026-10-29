import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('=== Checking licenses table schema ===')
  const schemaResult = await client.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'licenses'
    ORDER BY ordinal_position;
  `)
  console.log('Columns:', JSON.stringify(schemaResult.rows, null, 2))

  console.log('\n=== Checking if table exists ===')
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'licenses'
    );
  `)
  console.log('Table exists:', tableCheck.rows[0].exists)

} catch (error) {
  console.error('Error:', error)
}

await client.end()
