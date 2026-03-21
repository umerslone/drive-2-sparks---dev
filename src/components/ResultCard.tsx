import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface ResultCardProps {
  title: string
  icon: React.ReactNode
  content: string
  delay?: number
}

export function ResultCard({ title, icon, content, delay = 0 }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success(`${title} copied to clipboard`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-border/50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-primary">{icon}</div>
            <Badge variant="secondary" className="text-sm font-semibold">
              {title}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="shrink-0 hover:bg-accent/20"
          >
            {copied ? (
              <Check className="text-accent" weight="bold" size={20} />
            ) : (
              <Copy className="text-muted-foreground" weight="bold" size={20} />
            )}
          </Button>
        </div>
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </Card>
    </motion.div>
  )
}
