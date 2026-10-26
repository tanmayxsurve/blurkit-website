import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Configure for edge runtime compatibility
neonConfig.webSocketConstructor = ws

let pool: Pool | null = null

/**
 * Get database connection pool
 */
export function getDb(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    })
  }

  return pool
}

/**
 * Execute a database query
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const db = getDb()
  const result = await db.query(text, params)
  return result as { rows: T[]; rowCount: number }
}

/**
 * Close database connection
 */
export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
