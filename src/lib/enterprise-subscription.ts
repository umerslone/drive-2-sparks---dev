import { UserProfile, NGOAccessLevel } from "@/types"

/**
 * Enterprise Subscription & Team Access Management
 * Manages enterprise plan tiers, team member roles, and granular access control
 */

export type EnterpriseRole = "owner" | "admin" | "contributor" | "viewer"

export interface EnterpriseTeamMember {
  id: string
  email: string
  fullName: string
  role: EnterpriseRole
  ngoAccessLevel?: NGOAccessLevel
  addedAt: number
  lastActiveAt: number
}

export interface EnterpriseSubscription {
  organizationId: string
  plan: "starter" | "professional" | "enterprise"
  tier: "BASIC" | "PRO" | "TEAMS" | "ENTERPRISE"
  ownerId: string
  teamMembers: EnterpriseTeamMember[]
  features: {
    maxTeamMembers: number
    canAccessNGOSaaS: boolean
    canCustomizeBranding: boolean
    canManageRBAC: boolean
    canAuditLogs: boolean
    advancedAnalytics: boolean
  }
  billingCycle: "monthly" | "annual"
  renewalDate: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

const ENTERPRISE_SUBSCRIPTIONS_KEY = "enterprise-subscriptions"
const ENTERPRISE_TEAM_KEY = "enterprise-team"

/**
 * Get enterprise subscription for an organization
 */
export async function getEnterpriseSubscription(
  organizationId: string
): Promise<EnterpriseSubscription | null> {
  try {
    if (typeof spark !== "undefined" && spark.kv?.get) {
      const result = await spark.kv.get<EnterpriseSubscription>(`${ENTERPRISE_SUBSCRIPTIONS_KEY}-${organizationId}`)
      return result ?? null
    }
  } catch (e) {
    console.warn("[Enterprise] spark.kv.get failed:", e)
  }
  try {
    const raw = localStorage.getItem(`${ENTERPRISE_SUBSCRIPTIONS_KEY}-${organizationId}`)
    return raw ? (JSON.parse(raw) as EnterpriseSubscription) : null
  } catch (e) {
    console.warn("[Enterprise] localStorage.getItem failed:", e)
    return null
  }
}

/**
 * Save enterprise subscription
 */
export async function saveEnterpriseSubscription(sub: EnterpriseSubscription): Promise<void> {
  try {
    if (typeof spark !== "undefined" && spark.kv?.set) {
      await spark.kv.set(`${ENTERPRISE_SUBSCRIPTIONS_KEY}-${sub.organizationId}`, sub)
    }
  } catch (e) {
    console.warn("[Enterprise] spark.kv.set failed:", e)
  }
  try {
    localStorage.setItem(`${ENTERPRISE_SUBSCRIPTIONS_KEY}-${sub.organizationId}`, JSON.stringify(sub))
  } catch (e) {
    console.warn("[Enterprise] localStorage.setItem failed:", e)
  }
}

/**
 * Check if user has enterprise access
 */
export function hasEnterpriseAccess(user: UserProfile, organizationId?: string): boolean {
  if (user.role === "admin") return true
  const sub = user.subscription
  if (!sub) return false
  return sub.plan === "enterprise" && sub.status === "active"
}

/**
 * Check if user can manage enterprise (owner or admin role)
 */
export function canManageEnterprise(user: UserProfile, role?: EnterpriseRole): boolean {
  if (user.role === "admin") return true
  return role === "owner" || role === "admin"
}

/**
 * Check if user can modify content (owner, admin, or contributor)
 */
export function canModifyContent(role: EnterpriseRole): boolean {
  return role === "owner" || role === "admin" || role === "contributor"
}

/**
 * Check if user can grant/revoke access
 */
export function canGrantAccess(role: EnterpriseRole): boolean {
  return role === "owner" || role === "admin"
}

/**
 * Add team member to enterprise
 */
export async function addEnterpriseTeamMember(
  organizationId: string,
  email: string,
  fullName: string,
  role: EnterpriseRole,
  ngoAccessLevel?: NGOAccessLevel
): Promise<{ success: boolean; member?: EnterpriseTeamMember; error?: string }> {
  try {
    const sub = await getEnterpriseSubscription(organizationId)
    if (!sub) return { success: false, error: "Enterprise subscription not found" }

    if (sub.teamMembers.length >= sub.features.maxTeamMembers) {
      return { success: false, error: `Team member limit (${sub.features.maxTeamMembers}) reached` }
    }

    const normalizedEmail = email.toLowerCase().trim()
    if (sub.teamMembers.some((m) => m.email === normalizedEmail)) {
      return { success: false, error: "User is already a team member" }
    }

    const member: EnterpriseTeamMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: normalizedEmail,
      fullName,
      role,
      ngoAccessLevel,
      addedAt: Date.now(),
      lastActiveAt: Date.now(),
    }

    sub.teamMembers.push(member)
    sub.updatedAt = Date.now()
    await saveEnterpriseSubscription(sub)

    return { success: true, member }
  } catch (error) {
    console.error("Failed to add team member:", error)
    return { success: false, error: "Failed to add team member" }
  }
}

/**
 * Update team member role
 */
export async function updateTeamMemberRole(
  organizationId: string,
  memberId: string,
  newRole: EnterpriseRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const sub = await getEnterpriseSubscription(organizationId)
    if (!sub) return { success: false, error: "Enterprise subscription not found" }

    const memberIndex = sub.teamMembers.findIndex((m) => m.id === memberId)
    if (memberIndex === -1) return { success: false, error: "Team member not found" }

    sub.teamMembers[memberIndex].role = newRole
    sub.updatedAt = Date.now()
    await saveEnterpriseSubscription(sub)

    return { success: true }
  } catch (error) {
    console.error("Failed to update team member role:", error)
    return { success: false, error: "Failed to update team member role" }
  }
}

/**
 * Remove team member
 */
export async function removeEnterpriseTeamMember(
  organizationId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const sub = await getEnterpriseSubscription(organizationId)
    if (!sub) return { success: false, error: "Enterprise subscription not found" }

    const initialLength = sub.teamMembers.length
    sub.teamMembers = sub.teamMembers.filter((m) => m.id !== memberId)

    if (sub.teamMembers.length === initialLength) {
      return { success: false, error: "Team member not found" }
    }

    sub.updatedAt = Date.now()
    await saveEnterpriseSubscription(sub)
    return { success: true }
  } catch (error) {
    console.error("Failed to remove team member:", error)
    return { success: false, error: "Failed to remove team member" }
  }
}

/**
 * Grant NGO-SAAS access to team member
 */
export async function grantNGOAccess(
  organizationId: string,
  memberId: string,
  accessLevel: NGOAccessLevel
): Promise<{ success: boolean; error?: string }> {
  try {
    const sub = await getEnterpriseSubscription(organizationId)
    if (!sub) return { success: false, error: "Enterprise subscription not found" }

    if (!sub.features.canAccessNGOSaaS) {
      return { success: false, error: "NGO-SAAS not available on this plan" }
    }

    const member = sub.teamMembers.find((m) => m.id === memberId)
    if (!member) return { success: false, error: "Team member not found" }

    member.ngoAccessLevel = accessLevel
    sub.updatedAt = Date.now()
    await saveEnterpriseSubscription(sub)

    return { success: true }
  } catch (error) {
    console.error("Failed to grant NGO access:", error)
    return { success: false, error: "Failed to grant NGO access" }
  }
}

/**
 * Revoke NGO-SAAS access
 */
export async function revokeNGOAccess(
  organizationId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const sub = await getEnterpriseSubscription(organizationId)
    if (!sub) return { success: false, error: "Enterprise subscription not found" }

    const member = sub.teamMembers.find((m) => m.id === memberId)
    if (!member) return { success: false, error: "Team member not found" }

    member.ngoAccessLevel = undefined
    sub.updatedAt = Date.now()
    await saveEnterpriseSubscription(sub)

    return { success: true }
  } catch (error) {
    console.error("Failed to revoke NGO access:", error)
    return { success: false, error: "Failed to revoke NGO access" }
  }
}

/**
 * Get feature set for enterprise tier
 */
export function getEnterpriseFeatures(tier: "BASIC" | "PRO" | "TEAMS" | "ENTERPRISE") {
  switch (tier) {
    case "BASIC":
      return {
        maxTeamMembers: 1,
        canAccessNGOSaaS: false,
        canCustomizeBranding: false,
        canManageRBAC: false,
        canAuditLogs: false,
        advancedAnalytics: false,
      }
    case "PRO":
      return {
        maxTeamMembers: 5,
        canAccessNGOSaaS: false,
        canCustomizeBranding: false,
        canManageRBAC: false,
        canAuditLogs: false,
        advancedAnalytics: false,
      }
    case "TEAMS":
      return {
        maxTeamMembers: 25,
        canAccessNGOSaaS: false,
        canCustomizeBranding: true,
        canManageRBAC: true,
        canAuditLogs: false,
        advancedAnalytics: false,
      }
    case "ENTERPRISE":
      return {
        maxTeamMembers: 500,
        canAccessNGOSaaS: true,
        canCustomizeBranding: true,
        canManageRBAC: true,
        canAuditLogs: true,
        advancedAnalytics: true,
      }
  }
}
