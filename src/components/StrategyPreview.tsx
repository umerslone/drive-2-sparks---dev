import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SavedStrategy } from "@/types"

  strategy: SavedStrategy | null

}
export function StrategyPreview(

    { 
      content: strategy.result.marketingCopy,
 

      icon: <Palette size={18} weight="duotone" className="text-secondary" />
    { 

    },
      
      icon: <Code size={18} wei
    { 
      content: strategy.result.uiWorkflow,
    },
      
      icon: <Database size={18} 
    { 
      content: strategy.result.mobileWorkflow,
    },
      
      icon: <ListChecks size={18
  ]
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
   

          
                  <h3 className="font-semibold text-
                  </h3>
                <p className="text-sm text-muted-foreground leading-relaxed
                </p>
                  <Separator className="mt-4
              </div>
          </div>

          <div className="flex items-center justify-between gap-3">
              Preview showing first 30
            {onVie
                onClick={() => {
                  onOpenChange(false)
                size="
              >
              </But
          </div>
      </DialogContent>
  )



















































