import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('=== Webhook Events ===\n')
  
  const result = await client.query(`
    SELECT * FROM webhook_events 
    ORDER BY id DESC 
    LIMIT 10
  `)
  
  console.log(`Total webhook events: ${result.rows.length}`)
  
  if (result.rows.length > 0) {
    result.rows.forEach(event => {
      console.log('\n', event)
    })
  } else {
    console.log('\n❌ No webhook events found - Dodo is NOT calling your webhook!')
  }
  
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
