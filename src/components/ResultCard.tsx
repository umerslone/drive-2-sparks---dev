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
  variant?: "default" | "diagram" | "rich"
}

type MermaidNode = {
  id: string
  label: string
}

const parseMermaidNodes = (source: string): MermaidNode[] => {
  const normalized = source.replace(/;/g, "\n")
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean)
  const nodes = new Map<string, MermaidNode>()

  for (const line of lines) {
    const explicit = Array.from(line.matchAll(/([A-Za-z0-9_]+)\[([^\]]+)\]/g))
    for (const match of explicit) {
      const id = match[1]
      const label = match[2]
      if (!nodes.has(id)) {
        nodes.set(id, { id, label })
      }
    }

    const edgeOnly = line.match(/([A-Za-z0-9_]+)\s*-->\s*([A-Za-z0-9_]+)/)
    if (edgeOnly) {
      if (!nodes.has(edgeOnly[1])) nodes.set(edgeOnly[1], { id: edgeOnly[1], label: edgeOnly[1] })
      if (!nodes.has(edgeOnly[2])) nodes.set(edgeOnly[2], { id: edgeOnly[2], label: edgeOnly[2] })
    }
  }

  return Array.from(nodes.values())
}

const renderRichText = (content: string) => {
  const segments = content.split(/(```[\s\S]*?```)/g).filter(Boolean)

  return (
    <div className="space-y-3 text-foreground leading-relaxed">
      {segments.map((segment, index) => {
        if (segment.startsWith("```")) {
          const code = segment.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "")
          return (
            <pre key={`code-${index}`} className="rounded-md bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap">
              {code}
            </pre>
          )
        }

        const lines = segment.split("\n").filter((line) => line.trim().length > 0)
        return (
          <div key={`text-${index}`} className="space-y-2">
            {lines.map((line, lineIndex) => {
              const trimmed = line.trim()
              const isHeading = /^#{1,3}\s+/.test(trimmed)
              const isBullet = /^[-*]\s+/.test(trimmed)
              const isNumbered = /^\d+\.\s+/.test(trimmed)

              if (isHeading) {
                return (
                  <h4 key={`line-${lineIndex}`} className="text-sm font-semibold text-foreground">
                    {trimmed.replace(/^#{1,3}\s+/, "")}
                  </h4>
                )
              }

              if (isBullet || isNumbered) {
                return (
                  <p key={`line-${lineIndex}`} className="text-sm text-foreground/95 pl-3 border-l border-border/70">
                    {trimmed}
                  </p>
                )
              }

              return (
                <p key={`line-${lineIndex}`} className="text-sm text-foreground/95">
                  {trimmed}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const renderDiagram = (content: string) => {
  const nodes = parseMermaidNodes(content)

  return (
    <div className="space-y-4">
      {nodes.length > 0 && (
        <div className="rounded-lg border border-border/60 bg-muted/25 p-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {nodes.map((node, index) => (
              <div key={node.id} className="flex items-center gap-2">
                <div className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs font-medium whitespace-nowrap">
                  {node.label}
                </div>
                {index < nodes.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap">{content}</pre>
    </div>
  )
}

export function ResultCard({ title, icon, content, delay = 0, variant = "default" }: ResultCardProps) {
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
        <div className="text-foreground leading-relaxed">
          {variant === "diagram"
            ? renderDiagram(content)
            : variant === "rich"
              ? renderRichText(content)
              : <div className="whitespace-pre-wrap">{content}</div>}
        </div>
      </Card>
    </motion.div>
  )
}
