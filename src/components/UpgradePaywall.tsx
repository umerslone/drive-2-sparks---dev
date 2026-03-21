import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LockKey,
  Lightning,
  Crown,
  Users,
  CheckCircle,
  SpinnerGap,
  Gift,
  ArrowRight,
} from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { UserProfile } from "@/types"
import { PLAN_CONFIG, requestTrial, upgradeToPlan, TRIAL_CREDITS, TRIAL_MAX_SUBMISSIONS } from "@/lib/subscription"

interface UpgradePaywallProps {
  user: UserProfile
  feature: "review" | "humanize"
  onUpgraded?: () => void
}

export function UpgradePaywall({ user, feature, onUpgraded }: UpgradePaywallProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState<"pro" | "team" | null>(null)

  const trial = user.subscription?.trial
  const hasUsedTrial = !!trial?.requested
  const isTrialExhausted = !!trial?.exhausted

  const featureLabel = feature === "review" ? "Document Review" : "AI Humanizer"
  const featureDescription = feature === "review"
    ? "Plagiarism detection, AI content analysis, and document review require a Pro or Team subscription."
    : "The AI Humanizer module requires a Pro or Team subscription with active credits."

  const handleRequestTrial = async () => {
    setIsRequesting(true)
    try {
      const result = await requestTrial(user.id)
      if (result.success) {
        toast.success(`Trial activated! You have ${TRIAL_CREDITS} credits for ${TRIAL_MAX_SUBMISSIONS} document reviews.`)
        onUpgraded?.()
      } else {
        toast.error(result.error || "Failed to activate trial")
      }
    } finally {
      setIsRequesting(false)
    }
  }

  const handleUpgrade = async (plan: "pro" | "team") => {
    setIsUpgrading(plan)
    try {
      const result = await upgradeToPlan(user.id, plan)
      if (result.success) {
        toast.success(`Upgraded to ${PLAN_CONFIG[plan].name}! ${result.credits} credits added.`)
        onUpgraded?.()
      } else {
        toast.error(result.error || `Failed to upgrade to ${plan}`)
      }
    } finally {
      setIsUpgrading(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <LockKey size={28} weight="duotone" className="text-primary" />
          </div>
          <CardTitle className="text-xl">{featureLabel} — Premium Feature</CardTitle>
          <CardDescription className="text-sm max-w-lg mx-auto">
            {featureDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trial section - only for review, not for humanize */}
          {feature === "review" && !hasUsedTrial && (
            <Alert className="border-accent/40 bg-accent/5">
              <Gift size={18} className="text-accent" weight="duotone" />
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Try it free first!</p>
                  <p className="text-xs text-muted-foreground">
                    Get {TRIAL_CREDITS} credits for {TRIAL_MAX_SUBMISSIONS} document reviews. No payment required.
                    After {TRIAL_MAX_SUBMISSIONS} reviews, credits reset to zero and you'll need to upgrade.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRequestTrial}
                  disabled={isRequesting}
                  className="gap-2 shrink-0 border-accent/50 hover:bg-accent/10"
                >
                  {isRequesting ? (
                    <SpinnerGap size={16} className="animate-spin" />
                  ) : (
                    <Gift size={16} weight="bold" />
                  )}
                  Request Trial
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isTrialExhausted && (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertDescription className="text-sm">
                Your free trial has been used. Upgrade to Pro or Team to continue using {featureLabel}.
              </AlertDescription>
            </Alert>
          )}

          {/* Plan comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pro Plan */}
            <Card className="border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lightning size={20} weight="bold" className="text-primary" />
                  <CardTitle className="text-base">{PLAN_CONFIG.pro.name}</CardTitle>
                  <Badge variant="secondary" className="ml-auto text-xs">Popular</Badge>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold">${PLAN_CONFIG.pro.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {PLAN_CONFIG.pro.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle size={14} weight="fill" className="text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gap-2"
                  onClick={() => handleUpgrade("pro")}
                  disabled={isUpgrading !== null}
                >
                  {isUpgrading === "pro" ? (
                    <SpinnerGap size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} weight="bold" />
                  )}
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="border-accent/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users size={20} weight="bold" className="text-accent" />
                  <CardTitle className="text-base">{PLAN_CONFIG.team.name}</CardTitle>
                  <Badge className="ml-auto text-xs bg-accent/10 text-accent border-accent/30">Best Value</Badge>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold">${PLAN_CONFIG.team.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {PLAN_CONFIG.team.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle size={14} weight="fill" className="text-accent mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => handleUpgrade("team")}
                  disabled={isUpgrading !== null}
                >
                  {isUpgrading === "team" ? (
                    <SpinnerGap size={16} className="animate-spin" />
                  ) : (
                    <Crown size={16} weight="bold" />
                  )}
                  Upgrade to Team
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Plans are managed through your Techpigeon account. Contact support for billing questions.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
