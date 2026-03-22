/**
 * KV Sync Service — Bi-directional sync between localStorage and Neon DB.
 *
 * Neon table `kv_store` acts as the persistent source of truth.
 * localStorage acts as a fast read cache.
 *
 * Flow:
 *   set()  → localStorage + Neon (write-through)
 *   get()  → localStorage first, Neon fallback (read-through cache)
 *   push() → all local keys → Neon (bulk upload)
 *   pull() → all Neon rows → localStorage (bulk download)
 */

import { getNeonClient, isNeonConfigured } from "./neon-client"

const STORAGE_PREFIX = "spark-fallback-"
const SYNC_META_KEY = "kv-sync-last-ts"

// ─── Neon Table Setup ────────────────────────────────────────────────

export async function ensureKVTable(): Promise<void> {
  if (!isNeonConfigured()) return
  const sql = await getNeonClient()
  await sql`
    CREATE TABLE IF NOT EXISTS kv_store (
      key     TEXT PRIMARY KEY,
      value   JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
}

// ─── Single-Key Operations (used by the shim) ───────────────────────

export async function neonKVSet(key: string, value: unknown): Promise<void> {
  if (!isNeonConfigured()) return
  try {
    const sql = await getNeonClient()
    await sql`
      INSERT INTO kv_store (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
      ON CONFLICT (key)
      DO UPDATE SET value = ${JSON.stringify(value)}::jsonb, updated_at = now()
    `
  } catch (err) {
    console.warn("Neon KV set failed (non-blocking):", err)
  }
}

export async function neonKVGet<T>(key: string): Promise<T | undefined> {
  if (!isNeonConfigured()) return undefined
  try {
    const sql = await getNeonClient()
    const rows = await sql`SELECT value FROM kv_store WHERE key = ${key}` as { value: T }[]
    if (rows.length > 0) return rows[0].value
  } catch (err) {
    console.warn("Neon KV get failed (non-blocking):", err)
  }
  return undefined
}

export async function neonKVDelete(key: string): Promise<void> {
  if (!isNeonConfigured()) return
  try {
    const sql = await getNeonClient()
    await sql`DELETE FROM kv_store WHERE key = ${key}`
  } catch (err) {
    console.warn("Neon KV delete failed (non-blocking):", err)
  }
}

export async function neonKVKeys(): Promise<string[]> {
  if (!isNeonConfigured()) return []
  try {
    const sql = await getNeonClient()
    const rows = await sql`SELECT key FROM kv_store ORDER BY key` as { key: string }[]
    return rows.map((r) => r.key)
  } catch (err) {
    console.warn("Neon KV keys failed:", err)
    return []
  }
}

// ─── Bulk Sync Operations ────────────────────────────────────────────

/**
 * Push ALL localStorage KV data → Neon (local wins).
 * Use when you want to back up local state to the cloud.
 */
export async function pushLocalToNeon(): Promise<{ pushed: number; errors: number }> {
  if (!isNeonConfigured()) {
    throw new Error("Neon DB not configured. Add connection URL in Settings first.")
  }

  await ensureKVTable()

  let pushed = 0
  let errors = 0

  // Collect all spark-fallback- keys from localStorage
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i)
    if (fullKey?.startsWith(STORAGE_PREFIX)) {
      keys.push(fullKey.slice(STORAGE_PREFIX.length))
    }
  }

  const sql = await getNeonClient()

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      if (raw == null) continue
      const value = JSON.parse(raw)
      await sql`
        INSERT INTO kv_store (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
        ON CONFLICT (key)
        DO UPDATE SET value = ${JSON.stringify(value)}::jsonb, updated_at = now()
      `
      pushed++
    } catch (err) {
      console.warn(`Push failed for key "${key}":`, err)
      errors++
    }
  }

  // Record sync timestamp
  localStorage.setItem(SYNC_META_KEY, new Date().toISOString())

  return { pushed, errors }
}

/**
 * Pull ALL Neon KV data → localStorage (cloud wins).
 * Use to hydrate a new browser/device from the cloud.
 */
export async function pullNeonToLocal(): Promise<{ pulled: number; errors: number }> {
  if (!isNeonConfigured()) {
    throw new Error("Neon DB not configured. Add connection URL in Settings first.")
  }

  await ensureKVTable()

  let pulled = 0
  let errors = 0

  try {
    const sql = await getNeonClient()
    const rows = await sql`SELECT key, value FROM kv_store` as { key: string; value: unknown }[]

    for (const row of rows) {
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${row.key}`, JSON.stringify(row.value))
        pulled++
      } catch (err) {
        console.warn(`Pull failed for key "${row.key}":`, err)
        errors++
      }
    }
  } catch (err) {
    throw new Error(`Failed to pull from Neon: ${err instanceof Error ? err.message : "Unknown error"}`)
  }

  localStorage.setItem(SYNC_META_KEY, new Date().toISOString())

  return { pulled, errors }
}

/**
 * Two-way merge: keys that exist only locally go to Neon,
 * keys only in Neon go to local. For conflicts, Neon wins
 * (cloud is the source of truth for cross-device).
 */
export async function syncBidirectional(): Promise<{
  pushedToNeon: number
  pulledToLocal: number
  errors: number
}> {
  if (!isNeonConfigured()) {
    throw new Error("Neon DB not configured. Add connection URL in Settings first.")
  }

  await ensureKVTable()
  const sql = await getNeonClient()

  let pushedToNeon = 0
  let pulledToLocal = 0
  let errors = 0

  // 1. Get all Neon keys + values
  const neonRows = await sql`SELECT key, value FROM kv_store` as { key: string; value: unknown }[]
  const neonMap = new Map(neonRows.map((r) => [r.key, r.value]))

  // 2. Get all local keys
  const localKeys = new Set<string>()
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i)
    if (fullKey?.startsWith(STORAGE_PREFIX)) {
      localKeys.add(fullKey.slice(STORAGE_PREFIX.length))
    }
  }

  // 3. Pull: Neon → local (Neon wins for shared keys)
  for (const [key, value] of neonMap) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
      localKeys.delete(key) // Mark as handled
      pulledToLocal++
    } catch (err) {
      console.warn(`Sync pull failed for "${key}":`, err)
      errors++
    }
  }

  // 4. Push: local-only keys → Neon
  for (const key of localKeys) {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      if (raw == null) continue
      const value = JSON.parse(raw)
      await sql`
        INSERT INTO kv_store (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
        ON CONFLICT (key)
        DO UPDATE SET value = ${JSON.stringify(value)}::jsonb, updated_at = now()
      `
      pushedToNeon++
    } catch (err) {
      console.warn(`Sync push failed for "${key}":`, err)
      errors++
    }
  }

  localStorage.setItem(SYNC_META_KEY, new Date().toISOString())

  return { pushedToNeon, pulledToLocal, errors }
}

/**
 * Get last sync timestamp (for display).
 */
export function getLastSyncTime(): string | null {
  return localStorage.getItem(SYNC_META_KEY)
}

/**
 * Get sync status overview.
 */
export async function getSyncStatus(): Promise<{
  localKeyCount: number
  neonKeyCount: number
  lastSync: string | null
  neonConfigured: boolean
}> {
  let localKeyCount = 0
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i)?.startsWith(STORAGE_PREFIX)) localKeyCount++
  }

  let neonKeyCount = 0
  if (isNeonConfigured()) {
    try {
      const sql = await getNeonClient()
      const rows = await sql`SELECT COUNT(*) as count FROM kv_store` as { count: number }[]
      neonKeyCount = Number(rows[0]?.count ?? 0)
    } catch {
      // Table might not exist yet
    }
  }

  return {
    localKeyCount,
    neonKeyCount,
    lastSync: getLastSyncTime(),
    neonConfigured: isNeonConfigured(),
  }
}
