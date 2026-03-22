import { neon } from "@neondatabase/serverless"
import { storeSecret, retrieveSecret, hasSecret } from "@/lib/secret-store"

let sqlClient: ReturnType<typeof neon> | null = null

const NEON_DB_URL_KEY = "sentinel-neon-db-url"

export async function setNeonDbUrl(url: string): Promise<void> {
  await storeSecret(NEON_DB_URL_KEY, url)
  sqlClient = neon(url)
}

export function isNeonConfigured(): boolean {
  return hasSecret(NEON_DB_URL_KEY)
}

export async function getNeonClient(): Promise<ReturnType<typeof neon>> {
  if (sqlClient) return sqlClient

  const url = await retrieveSecret(NEON_DB_URL_KEY)
  if (!url) {
    throw new Error("Neon database URL not configured. Go to Admin → Settings to add it.")
  }

  sqlClient = neon(url)
  return sqlClient
}

export async function testConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const sql = await getNeonClient()
    const result = await sql`SELECT 1 as ping` as Record<string, unknown>[]
    return { ok: result.length > 0 }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Connection failed" }
  }
}
