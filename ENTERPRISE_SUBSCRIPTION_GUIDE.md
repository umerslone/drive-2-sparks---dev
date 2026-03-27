# Enterprise Subscription & Team Access Management System

## Overview

The enterprise subscription system manages multi-tiered SaaS subscriptions for organizations, with granular team member access control and NGO-SAAS module delegation.

## Architecture

### Core Components

#### 1. **src/lib/enterprise-subscription.ts** (Service Layer)
Business logic for subscription and team management:

```typescript
// Create/retrieve subscription
const subscription = await getEnterpriseSubscription(organizationId)
await saveEnterpriseSubscription(subscription)

// Team member management
await addEnterpriseTeamMember(orgId, email, name, role, ngoAccessLevel)
await removeEnterpriseTeamMember(orgId, memberId)
await updateTeamMemberRole(orgId, memberId, newRole)

// NGO-SAAS access delegation
await grantNGOAccess(orgId, memberId, "owner")
await revokeNGOAccess(orgId, memberId)

// Permission checking
canManageEnterprise(user, role)
canModifyContent(role)
canGrantAccess(role)
```

#### 2. **src/components/EnterpriseAdmin.tsx** (UI Dashboard)
Admin interface for managing enterprise subscriptions:

- **Subscription Overview**: View plan, tier, billing cycle, renewal date, feature availability
- **Team Member Management**: Add/remove members, assign roles dynamically
- **NGO-SAAS Access**: Grant/revoke module access per team member
- **Limits Enforcement**: Team member count limits by tier, visual feedback

#### 3. **src/App.tsx Integration**
- New "Enterprise" tab in admin-only navigation (after Admin tab)
- Routed via organizationId from user.id
- Accessible only to users with role === "admin"

## Subscription Tiers

| Tier | Members | NGO-SAAS | Branding | RBAC | Audit Logs | Analytics |
|------|---------|----------|----------|------|------------|-----------|
| BASIC | 1 | ❌ | ❌ | ❌ | ❌ | ❌ |
| PRO | 5 | ❌ | ❌ | ❌ | ❌ | ❌ |
| TEAMS | 25 | ❌ | ✅ | ✅ | ❌ | ❌ |
| ENTERPRISE | 500 | ✅ | ✅ | ✅ | ✅ | ✅ |

## Team Member Roles

### Owner
- Full permissions: create, edit, delete content
- Can manage team members and assign roles
- Can grant/revoke NGO-SAAS access
- Can access all features

### Admin
- Full permissions: create, edit, delete content
- Can manage team members and assign roles
- Can grant/revoke NGO-SAAS access
- Can access all features

### Contributor
- Can create and edit content
- Cannot delete or manage team members
- Cannot grant access unless admin/owner
- Can access all assigned features

### Viewer
- Read-only access to all content
- Cannot modify or delete
- Cannot manage team members
- Can view assigned features

## NGO-SAAS Access Levels

When NGO-SAAS is available (TEAMS/ENTERPRISE tiers), team members can be granted:

- **owner**: Full NGO-SAAS access with team management
- **contributor**: Can create projects and modify content
- **user**: Read-only access to NGO-SAAS features

## Usage Examples

### Add Team Member to Enterprise

```typescript
import { addEnterpriseTeamMember } from "@/lib/enterprise-subscription"

const result = await addEnterpriseTeamMember(
  "org-001",
  "jane@company.com",
  "Jane Smith",
  "contributor"
)

if (result.success) {
  console.log("Member added:", result.member)
} else {
  console.error("Failed:", result.error)
}
```

### Grant NGO-SAAS Access

```typescript
import { grantNGOAccess } from "@/lib/enterprise-subscription"

const result = await grantNGOAccess(
  "org-001",
  "member-001",
  "contributor"
)

if (result.success) {
  console.log("NGO access granted")
} else {
  console.error("Failed:", result.error)
}
```

### Check Permissions

```typescript
import { canManageEnterprise, canModifyContent } from "@/lib/enterprise-subscription"

if (canManageEnterprise(user, "admin")) {
  // User can manage enterprise
}

if (canModifyContent("contributor")) {
  // Role can modify content
}
```

## Data Storage

Subscriptions are stored with dual-store persistence:
- **Primary**: KV store (enterprise KV store)
- **Fallback**: localStorage (browser storage)

Both stores are kept in sync. If KV is unavailable, localStorage provides fallback persistence.

## Integration with NGO-SAAS Module

The enterprise system integrates with the NGO-SAAS module:

1. **Access Gating**: NGO-SAAS tab only appears if user has `canAccessNGOSaaS === true`
2. **Team Access**: Team members added to enterprise automatically get NGO access levels
3. **Dual Control**: Access can be managed via:
   - Enterprise Admin dashboard (grant/revoke per member)
   - Subscription entitlements check in NGOModule component

## API Reference

### Subscription Functions

**getEnterpriseSubscription(organizationId: string)**
- Returns: `Promise<EnterpriseSubscription | null>`
- Gets subscription for organization

**saveEnterpriseSubscription(subscription: EnterpriseSubscription)**
- Returns: `Promise<void>`
- Persists subscription to storage

### Team Management

**addEnterpriseTeamMember(organizationId, email, fullName, role, ngoAccessLevel?)**
- Returns: `Promise<{ success: boolean; member?: EnterpriseTeamMember; error?: string }>`
- Adds new team member to enterprise

**updateTeamMemberRole(organizationId, memberId, newRole)**
- Returns: `Promise<{ success: boolean; error?: string }>`
- Updates team member's role

**removeEnterpriseTeamMember(organizationId, memberId)**
- Returns: `Promise<{ success: boolean; error?: string }>`
- Removes team member from enterprise

### NGO-SAAS Access

**grantNGOAccess(organizationId, memberId, accessLevel)**
- Returns: `Promise<{ success: boolean; error?: string }>`
- Grants NGO-SAAS module access to team member

**revokeNGOAccess(organizationId, memberId)**
- Returns: `Promise<{ success: boolean; error?: string }>`
- Revokes NGO-SAAS module access

### Permission Checks

**hasEnterpriseAccess(user, organizationId?)**
- Returns: `boolean`
- Checks if user has enterprise access

**canManageEnterprise(user, role?)**
- Returns: `boolean`
- Checks if user can manage enterprise

**canModifyContent(role)**
- Returns: `boolean`
- Checks if role can modify content (owner/admin/contributor)

**canGrantAccess(role)**
- Returns: `boolean`
- Checks if role can grant access (owner/admin only)

### Configuration

**getEnterpriseFeatures(tier)**
- Returns: Feature set for tier
- Tiers: "BASIC" | "PRO" | "TEAMS" | "ENTERPRISE"

## Admin Dashboard Features

Access via the "Enterprise" tab in admin navigation.

### Subscription Overview Panel
- View plan, tier, billing cycle, renewal date
- See feature availability matrix for current tier
- Track team member usage vs. limits

### Add Team Member Form
- Email input with validation
- Full name input
- Role dropdown (owner/admin/contributor/viewer)
- Add button with member limit check

### Team Members Table
- List all current team members
- View member name, email, added date
- Dynamic role selector (update role immediately)
- NGO access control (grant/revoke per member)
- Action buttons (remove member)

## Error Handling

All functions return `{ success: boolean; error?: string }` pattern:

```typescript
const result = await addEnterpriseTeamMember(...)
if (!result.success) {
  // Handle error from result.error
  console.error(result.error)
}
```

Common errors:
- "Enterprise subscription not found"
- "Team member limit reached"
- "User is already a team member"
- "NGO-SAAS not available on this plan"
- "Team member not found"

## Testing

Run validation tests with:
```bash
npx tsc --noEmit  # Type check
```

Test suite in `src/__tests__/enterprise-subscription.test.ts` validates:
- Feature entitlements by tier
- Role-based access control
- Access grant permissions
- Subscription data structure integrity

## Future Enhancements

Potential expansions:
- Audit logs for all team member changes
- Email notifications for member invitations
- Custom feature toggles per subscription
- Billing integration for monthly/annual cycles
- SSO/SAML integration for enterprise teams
- Advanced analytics dashboards
- Usage quotas and rate limiting
