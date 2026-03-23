# Enterprise Subscription System - Architecture & Design Decisions

## User's Requirement (from incomplete message)

"There must be separate system to manage enterprise subscriptions and access granted to users with team access"

This requirement was interpreted and implemented as:

## What We Built

A **complete, independent enterprise subscription management system** that:

1. **Manages Enterprise Subscriptions** separately from base app subscriptions
   - Independent 4-tier model (BASIC/PRO/TEAMS/ENTERPRISE)
   - Separate storage (organizationId-based)
   - Own billing cycle and renewal tracking
   - Distinct from user.subscription in SubscriptionInfo

2. **Grants Access to Team Members** through multiple mechanisms
   - Team member RBAC (owner/admin/contributor/viewer)
   - NGO-SAAS module access delegation (owner/contributor/user)
   - Role-based permission gates
   - Feature entitlements by tier

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     App User Login                          │
│                    (user.subscription)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌─────────────────┐        ┌──────────────────────┐
        │  Basic Features │        │  Admin User Check    │
        │  (Pro/Basic)    │        │  (role === "admin")  │
        └─────────────────┘        └──────────────────────┘
                                            │
                                            ▼
                            ┌───────────────────────────────┐
                            │  Enterprise Admin Access      │
                            │  - New Enterprise Tab         │
                            │  - Manage Subscriptions       │
                            │  - Control Team Access       │
                            └───────────────────────────────┘
                                            │
                ┌───────────────────────────┴───────────────────────────┐
                ▼                                                       ▼
    ┌──────────────────────────────┐                ┌─────────────────────────────┐
    │ Enterprise Subscription DB   │                │ Team Member Access Control  │
    │ (organizationId-based)       │                │ (role & ngoAccessLevel)     │
    │                              │                │                             │
    │ - Plan & Tier               │                │ - Owner (full permissions)  │
    │ - Billing Cycle             │                │ - Admin (manage team)       │
    │ - Renewal Date              │                │ - Contributor (create/edit) │
    │ - Feature Entitlements      │                │ - Viewer (read-only)        │
    │ - Team Members List         │                │                             │
    │                              │                │ NGO-SAAS Access:            │
    │                              │                │ - owner                     │
    │                              │                │ - contributor               │
    │                              │                │ - user                      │
    └──────────────────────────────┘                └─────────────────────────────┘
                    │                                           │
                    └───────────────────┬───────────────────────┘
                                        ▼
                    ┌─────────────────────────────────────┐
                    │  NGO-SAAS Module Access Gate        │
                    │  (canAccessNGOSaaS check)          │
                    │                                     │
                    │  Only if:                           │
                    │  - Enterprise plan enabled          │
                    │  - ngoTeamAdminId set               │
                    │  - ngoAccessLevel set               │
                    └─────────────────────────────────────┘
                                        ▼
                    ┌─────────────────────────────────────┐
                    │  NGO-SAAS Module Features Available │
                    │  - Data Workspace                   │
                    │  - AI Actions                       │
                    │  - Team Tab                         │
                    │  - Report Generation                │
                    │  - Org Branding                     │
                    └─────────────────────────────────────┘
```

## Three Layers of Access Control

### Layer 1: User Subscription (Base App)
Controls core app features (Strategy, Ideas, Review, Dashboard, etc.)
Located in: `user.subscription` (SubscriptionInfo type)

### Layer 2: Enterprise Subscription (New System)
Controls enterprise-wide features and billing
Located in: `spark.kv[enterprise-subscriptions-{orgId}]` (EnterpriseSubscription type)
Managed by: Admin via Enterprise tab in App.tsx

### Layer 3: Team Access (New System)
Controls individual user access within enterprise
Located in: `EnterpriseSubscription.teamMembers[]`
Managed by: Enterprise team (owner/admin roles)

## How It Works: User Journey

### Scenario 1: Basic User (no enterprise)
```
User signs up → user.subscription = basic/pro → Regular app features only
No enterprise subscription → Cannot see Enterprise tab or NGO-SAAS
```

### Scenario 2: Admin Creates Enterprise
```
Admin user (role="admin") → Sees new "Enterprise" tab
Admin creates subscription via EnterpriseAdmin dashboard → organizationId = admin user.id
Admin adds team members with roles → teamMembers array populated
Enterprise subscription saved to spark.kv
```

### Scenario 3: Team Member Joins
```
Admin adds team member (john@company.com) as "contributor"
System creates EnterpriseTeamMember entry with role="contributor"
John logs in → User exists with user.subscription (base app tier)
AND system checks: is john.email in enterprise.teamMembers?
If yes → Check role permissions + ngoAccessLevel
If ngoAccessLevel exists → NGO-SAAS access granted → John sees NGO-SAAS tab
```

### Scenario 4: Admin Grants NGO-SAAS Access
```
Admin opens Enterprise tab → Team Members table
Admin selects john@company.com
Admin chooses "Grant NGO Access" → Selects "contributor" level
System updates: john's teamMember.ngoAccessLevel = "contributor"
Next login: NGO-SAAS tab visible → John has NGO access at contributor level
```

## Key Design Decisions

### 1. Separate Storage (organizationId-based)
✅ Pro: Independent from user subscriptions, can scale per organization
✅ Pro: Billing and team management isolated
❌ Con: Requires passing organizationId (we use user.id as orgId)

### 2. Dual-Store Persistence (spark.kv + localStorage)
✅ Pro: Works even if enterprise KV service down
✅ Pro: Offline-first capability
✅ Pro: Fallback resilience

### 3. Team Member Email-based Lookup
✅ Pro: Universal identifier (works across systems)
✅ Pro: Email can be verified for team membership
❌ Con: Need to handle email case-sensitivity (we normalize to lowercase)

### 4. Role-based vs. Feature-based Permissions
✅ Pro: Simpler mental model (owner/admin/contributor/viewer)
✅ Pro: Easier to audit and understand
✅ Pro: Scales to complex orgs
❌ Con: Less granular than feature flags (but can be added later)

### 5. NGO-SAAS as Tier Feature (not base app feature)
✅ Pro: Only enterprise orgs get NGO module
✅ Pro: Prevents feature creep to free tier
✅ Pro: Clear upsell story
❌ Con: Team members can't access NGO without enterprise subscription

## Integration Points

### With Existing NGO-SAAS Module
- NGOModule.tsx checks: `canAccessNGOSaaS` from subscription.ts
- subscription.ts check includes: `subscription.ngoTeamAdminId && subscription.ngoAccessLevel`
- These fields come from enterprise system (set when admin adds user)

### With Existing App.tsx Navigation
- Enterprise tab appears only if: `user.role === "admin"`
- NGO-SAAS tab appears only if: `canAccessNGOSaaS === true`
- Both gates work independently and together

### With Existing User Authentication
- No changes needed to auth flow
- Users still sign in normally
- Enterprise membership is checked at component level
- Not required for login - optional for features

## Future Expansion Points

### 1. Email Invitations
Send invites to john@company.com before he signs up
Team membership created on first login
Automatic role assignment from invite

### 2. Audit Logging
Track all team changes (added, role changed, access granted)
Store in: `spark.kv[enterprise-audit-{orgId}]`
Display in admin dashboard with timestamps

### 3. Billing Integration
Connect to Stripe/payment processor
Auto-calculate team seats used
Enforce overage penalties or limits

### 4. SSO/SAML
Enterprise users sign in via company SSO
Team membership synced from directory
Automatic role mapping

### 5. Custom Features per Subscription
Allow different feature sets per tier:
- Starter: basic dashboard
- Professional: + NGO-SAAS
- Teams: + custom branding + audit logs
- Enterprise: + all features + priority support

### 6. Hierarchical Teams
Sub-teams within enterprise
Different access levels per team
Budget allocation per team

## Testing the System

### Manual Testing Checklist
- [ ] Admin sees "Enterprise" tab in nav
- [ ] Can add team member (email validation)
- [ ] Member limit enforced (different per tier)
- [ ] Can change member role (updates immediately)
- [ ] Can remove member (confirmation dialog)
- [ ] Can grant NGO access (feature visible if tier supports)
- [ ] Can revoke NGO access
- [ ] Subscription displays correct plan/tier/billing
- [ ] Feature matrix shows correct availability

### Automated Tests
See: `src/__tests__/enterprise-subscription.test.ts`
- Feature entitlements progression
- Role permission validation
- Access grant checks
- Subscription structure integrity

## Troubleshooting

### Team member can't access NGO-SAAS
1. Check: Is user in enterprise.teamMembers? (email match)
2. Check: Does user have ngoAccessLevel set?
3. Check: Is enterprise subscription tier ENTERPRISE or TEAMS?
4. Check: Is enterprise.isActive === true?

### Admin can't see Enterprise tab
1. Check: Is user.role === "admin"?
2. Check: Are you on main branch (feature not on other branches)?

### Team member limit showing as full
1. Check: `subscription.features.maxTeamMembers` for tier
2. Check: `subscription.teamMembers.length` actual count
3. Upgrade tier if needed

## Related Files

- Core: `src/lib/enterprise-subscription.ts`
- UI: `src/components/EnterpriseAdmin.tsx`
- Integration: `src/App.tsx` (Enterprise tab)
- Tests: `src/__tests__/enterprise-subscription.test.ts`
- Guide: `ENTERPRISE_SUBSCRIPTION_GUIDE.md`
- NGO: `src/components/NGOModule.tsx` (access gating)
- Subscription: `src/lib/subscription.ts` (entitlements)
