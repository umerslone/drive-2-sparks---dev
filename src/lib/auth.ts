import { UserProfile } from "@/types"

const USERS_STORAGE_KEY = "platform-users"
const CURRENT_USER_KEY = "current-user-id"

export const authService = {
  async initializeMasterAdmin(): Promise<void> {
    return Promise.resolve()
  },

  async loginWithGitHub(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const githubUser = await spark.user()
      
      if (!githubUser || !githubUser.login) {
        return { success: false, error: "GitHub authentication failed" }
      }

      const users = await spark.kv.get<Record<string, UserProfile>>(USERS_STORAGE_KEY) || {}
      
      const role = githubUser.isOwner ? "admin" : "client"
      
      let user = users[githubUser.login]
      
      if (!user) {
        user = {
          id: githubUser.id,
          email: githubUser.email || `${githubUser.login}@github.user`,
          fullName: githubUser.login,
          role: role,
          avatarUrl: githubUser.avatarUrl,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        }
        
        users[githubUser.login] = user
        await spark.kv.set(USERS_STORAGE_KEY, users)
      } else {
        user.lastLoginAt = Date.now()
        user.role = role
        user.avatarUrl = githubUser.avatarUrl
        
        if (githubUser.email) {
          user.email = githubUser.email
        }
        
        users[githubUser.login] = user
        await spark.kv.set(USERS_STORAGE_KEY, users)
      }

      await spark.kv.set(CURRENT_USER_KEY, user.id)

      return { success: true, user }
    } catch (error) {
      console.error("GitHub login error:", error)
      return { success: false, error: "GitHub authentication failed. Please try again." }
    }
  },

  async logout(): Promise<void> {
    await spark.kv.delete(CURRENT_USER_KEY)
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const githubUser = await spark.user()
      
      if (!githubUser || !githubUser.login) {
        return null
      }

      const users = await spark.kv.get<Record<string, UserProfile>>(USERS_STORAGE_KEY) || {}
      let user = users[githubUser.login]
      
      if (!user) {
        const loginResult = await this.loginWithGitHub()
        return loginResult.user || null
      }

      const role = githubUser.isOwner ? "admin" : "client"
      if (user.role !== role) {
        user.role = role
        users[githubUser.login] = user
        await spark.kv.set(USERS_STORAGE_KEY, users)
      }
      
      return user
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const users = await spark.kv.get<Record<string, UserProfile>>(USERS_STORAGE_KEY) || {}
      const user = Object.values(users).find(u => u.id === userId)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      const githubUser = await spark.user()
      const githubLogin = Object.keys(users).find(login => users[login].id === userId)

      const updatedUser = { 
        ...user, 
        ...updates, 
        id: user.id, 
        email: user.email, 
        createdAt: user.createdAt,
        role: user.role,
        avatarUrl: githubUser?.avatarUrl || user.avatarUrl
      }
      
      if (githubLogin) {
        users[githubLogin] = updatedUser
        await spark.kv.set(USERS_STORAGE_KEY, users)
      }

      return { success: true, user: updatedUser }
    } catch (error) {
      console.error("Update profile error:", error)
      return { success: false, error: "Failed to update profile. Please try again." }
    }
  },
}
