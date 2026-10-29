import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('=== Orders Table Schema ===\n')
  
  const schemaResult = await client.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'orders'
    ORDER BY ordinal_position
  `)
  
  console.log('Columns:')
  schemaResult.rows.forEach(row => {
    console.log(`  - ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`)
  })
  
  console.log('\n=== Orders Data ===')
  const dataResult = await client.query('SELECT * FROM orders LIMIT 5')
  console.log(`Total rows: ${dataResult.rows.length}`)
  if (dataResult.rows.length > 0) {
    console.log(JSON.stringify(dataResult.rows, null, 2))
  }
  
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
