/**
 * Sentinel SAAS - Database Seed
 *
 * DEPRECATED: Commander provisioning is now handled exclusively by the
 * backend (`POST /api/auth/register` with SENTINEL_COMMANDER role).
 * The hardcoded default password was removed from client-side config
 * as part of security fix C2/C3.
 *
 * This function is retained as a no-op so existing callers don't break.
 * Subscription tier seeding should be done via backend migration SQL.
 */

export async function seedSentinelCommander(): Promise<void> {
  console.info(
    "seedSentinelCommander() is a no-op — commander provisioning is now backend-only."
  )
}
