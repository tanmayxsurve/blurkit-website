import { config } from 'dotenv'
import { Client } from '@neondatabase/serverless'

config()

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  console.log('=== All Tables in Neon Database ===\n')
  
  const tablesResult = await client.query(`
    SELECT table_name, 
           (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)
  
  console.log(`Total tables: ${tablesResult.rows.length}\n`)
  
  for (const table of tablesResult.rows) {
    console.log(`📊 ${table.table_name} (${table.column_count} columns)`)
    
    // Get columns for this table
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table.table_name])
    
    columnsResult.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' (NOT NULL)' : ''}`)
    })
    
    // Get row count
    const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`)
    console.log(`   📈 Rows: ${countResult.rows[0].count}\n`)
  }
  
} catch (error) {
  console.error('Error:', error.message)
}

await client.end()
