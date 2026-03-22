import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChatsCircle, Palette, Target, Code, Desktop, Database, DeviceMobile, ListChecks } from "@phosphor-icons/react"
import { SavedStrategy } from "@/types"

interface StrategyPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  strategy: SavedStrategy | null
  onViewFull?: () => void
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function StrategyPreview({ open, onOpenChange, strategy, onViewFull }: StrategyPreviewProps) {
  if (!strategy) return null

  const sections = [
    { 
      title: "Marketing Copy", 
      content: strategy.result.marketingCopy,
      icon: <ChatsCircle size={18} weight="duotone" className="text-primary" />
    },
    { 
      title: "Visual Strategy", 
      content: strategy.result.visualStrategy,
      icon: <Palette size={18} weight="duotone" className="text-secondary" />
    },
    { 
      title: "Target Audience", 
      content: strategy.result.targetAudience,
      icon: <Target size={18} weight="duotone" className="text-accent" />
    },
    { 
      title: "Application Workflow", 
      content: strategy.result.applicationWorkflow,
      icon: <Code size={18} weight="duotone" className="text-primary" />
    },
    { 
      title: "UI Workflow", 
      content: strategy.result.uiWorkflow,
      icon: <Desktop size={18} weight="duotone" className="text-secondary" />
    },
    { 
      title: "Database Workflow", 
      content: strategy.result.databaseWorkflow,
      icon: <Database size={18} weight="duotone" className="text-accent" />
    },
    { 
      title: "Mobile Workflow", 
      content: strategy.result.mobileWorkflow,
      icon: <DeviceMobile size={18} weight="duotone" className="text-primary" />
    },
    { 
      title: "Implementation Checklist", 
      content: strategy.result.implementationChecklist,
      icon: <ListChecks size={18} weight="duotone" className="text-secondary" />
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {strategy.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  {section.icon}
                  {section.title}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {truncateText(section.content || "Not available", 300)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Preview showing first 300 characters per section
          </p>
          {onViewFull && (
            <Button onClick={onViewFull} size="sm">
              View Full Strategy
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
