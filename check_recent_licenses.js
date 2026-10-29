import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('=== All Licenses in Database ===\n')
  
  const result = await client.query(`
    SELECT id, email, license_key, plan_id, session_id, created_at 
    FROM licenses 
    ORDER BY created_at DESC
  `)
  
  console.log(`Total licenses: ${result.rows.length}\n`)
  
  result.rows.forEach((license, index) => {
    console.log(`${index + 1}. Email: ${license.email}`)
    console.log(`   License: ${license.license_key}`)
    console.log(`   Plan: ${license.plan_id}`)
    console.log(`   Session: ${license.session_id}`)
    console.log(`   Created: ${new Date(license.created_at).toLocaleString()}`)
    console.log('')
  })
  
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
