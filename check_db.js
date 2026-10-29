import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  const result = await client.query('SELECT * FROM licenses ORDER BY created_at DESC LIMIT 10;')
  console.log('Recent licenses:')
  console.log(JSON.stringify(result.rows, null, 2))
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
