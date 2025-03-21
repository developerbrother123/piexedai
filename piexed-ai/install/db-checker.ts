"use server"

import { Pool } from "pg"

interface DbConfig {
  host: string
  port: string
  user: string
  password: string
  database: string
}

interface TableCheckResult {
  table: string
  exists: boolean
}

export async function checkDatabaseTables(dbConfig: DbConfig) {
  try {
    const pool = new Pool({
      host: dbConfig.host,
      port: Number.parseInt(dbConfig.port),
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    })

    // Essential tables to check
    const essentialTables = [
      "users",
      "settings",
      "subscription_plans",
      "subscriptions",
      "ai_models",
      "conversations",
      "messages",
      "api_usage",
      "storage_items",
      "payments",
    ]

    const results: TableCheckResult[] = []

    for (const table of essentialTables) {
      const { rows } = await pool.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `,
        [table],
      )

      results.push({
        table,
        exists: rows[0].exists,
      })
    }

    await pool.end()

    return results
  } catch (error) {
    console.error("Database check error:", error)
    throw error
  }
}

