export interface MarketingResult {
  marketingCopy: string
  visualStrategy: string
  targetAudience: string
  applicationWorkflow?: string
  uiWorkflow?: string
  databaseWorkflow?: string
  mobileWorkflow?: string
  implementationChecklist?: string
}

export interface SavedStrategy {
  id: string
  name: string
  description: string
  result: MarketingResult
  timestamp: number
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  company?: string
  role?: string
  industry?: string
  bio?: string
  avatarUrl?: string
  createdAt: number
  lastLoginAt: number
}

export interface UserCredentials {
  email: string
  password: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
}
