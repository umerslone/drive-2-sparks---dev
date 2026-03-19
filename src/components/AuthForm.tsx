import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkle, GithubLogo } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { authService } from "@/lib/auth"
import { toast } from "sonner"
import { UserProfile } from "@/types"

interface AuthFormProps {
  onAuthSuccess: (user: UserProfile) => void
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = async () => {
    setIsLoading(true)

    try {
      const result = await authService.loginWithGitHub()

      if (result.success && result.user) {
        toast.success(`Welcome, ${result.user.fullName}!`)
        onAuthSuccess(result.user)
      } else {
        toast.error(result.error || "Authentication failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_oklch(0.65_0.22_240_/_0.08)_0%,_transparent_50%),radial-gradient(circle_at_70%_80%,_oklch(0.48_0.18_240_/_0.1)_0%,_transparent_50%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkle size={36} weight="duotone" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              TechPigeon Assistant
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sign in with your GitHub account
          </p>
        </div>

        <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Authenticate using GitHub to access the platform
              </p>
              <p className="text-xs text-muted-foreground">
                Spark admins will have administrator access. All other users will have client access.
              </p>
            </div>

            <Button
              onClick={handleGitHubLogin}
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  <GithubLogo size={24} weight="bold" />
                  Sign in with GitHub
                </>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <p>By signing in, you agree to our terms of service</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
