import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SavedStrategy } from "@/types"
import { ChatsCircle, Palette, Target, Code, Desktop, Database, DeviceMobile, ListChecks, X } from "@phosphor-icons/react"

interface StrategyPreviewProps {
  strategy: SavedStrategy | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewFull?: (strategy: SavedStrategy) => void
}

export function StrategyPreview({ strategy, open, onOpenChange, onViewFull }: StrategyPreviewProps) {
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {strategy.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {strategy.description}
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                {new Date(strategy.timestamp).toLocaleString()}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <X size={20} weight="bold" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-180px)] px-6">
          <div className="space-y-4 py-4">
            {sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="font-semibold text-sm text-foreground">
                    {section.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                  {truncateText(section.content || "Not available", 300)}
                </p>
                {index < sections.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border/50 bg-muted/30">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Preview showing first 300 characters of each section
            </p>
            {onViewFull && (
              <Button
                onClick={() => {
                  onViewFull(strategy)
                  onOpenChange(false)
                }}
                size="sm"
                className="gap-2"
              >
                View Full Strategy
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
