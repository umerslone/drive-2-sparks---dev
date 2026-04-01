import crypto from "node:crypto"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcrypt"

const email = "admin@novussparks.com"
const password = "Root@novussparks2026!"
const fullName = "NovusSparks Admin"
const role = "SENTINEL_COMMANDER"

const dbUrl = process.env.NEON_DATABASE_URL
if (!dbUrl) {
  throw new Error("NEON_DATABASE_URL is required")
}

const sql = neon(dbUrl)

;(async () => {
  const passwordHash = await bcrypt.hash(password, 12)
  const emailLower = email.toLowerCase()

  const existing = await sql`
    SELECT id, role
    FROM sentinel_users
    WHERE email = ${emailLower}
    LIMIT 1
  `

  if (existing.length > 0) {
    await sql`
      UPDATE sentinel_users
      SET password_hash = ${passwordHash},
          role = ${role},
          full_name = ${fullName},
          is_active = TRUE
      WHERE id = ${existing[0].id}
    `
    console.log(`updated_user ${existing[0].id} role ${role}`)
  } else {
    const userId = crypto.randomUUID()
    await sql`
      INSERT INTO sentinel_users (id, email, full_name, password_hash, role, organization_id, is_active)
      VALUES (${userId}, ${emailLower}, ${fullName}, ${passwordHash}, ${role}, NULL, TRUE)
    `
    console.log(`created_user ${userId} role ${role}`)
  }
})().catch(err => {
  console.error(err)
  process.exit(1)
})
