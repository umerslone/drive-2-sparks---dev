import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SavedStrategy } from "@/types"
import { ChatsCircle, Palette, Target, Code, Desktop, Database, DeviceMobile, ListChecks } from "@phosphor-icons/react"

interface StrategyPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  strategy: SavedStrategy | null
  onViewFull?: () => void
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

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "No content available"
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{strategy.name}</span>
            <Badge variant="outline" className="text-xs">
              {new Date(strategy.timestamp).toLocaleDateString()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="font-semibold text-sm text-foreground">
                    {section.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {truncateText(section.content, 300)}
                </p>
                {index < sections.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between gap-3 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Preview showing first 300 characters per section
          </p>
          {onViewFull && (
            <Button 
              onClick={() => {
                onOpenChange(false)
                onViewFull()
              }}
              size="sm"
            >
              View Full Strategy
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
