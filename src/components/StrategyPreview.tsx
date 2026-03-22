import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChatsCircle, Palette, Target, Code, Desktop, Database, DeviceMobile, ListChecks } from "@phosphor-icons/react"


  strategy: SavedStrategy | null
}
  onOpenChange: (open: boolean) => void
  strategy: SavedStrategy | null
  onViewFull?: () => void
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

      icon: <ChatsCircle size={18} weight="duotone" className="text-primary" />
    { 

    },
      
      icon: <Target size={18} w
    { 
      content: strategy.result.applicationWorkflow,
    },
      
      icon: <Desktop size={18} w
    { 
      content: strategy.result.databaseWorkflow,
    },
      
      icon: <DeviceMobile size={
    { 
      content: strategy.result.implementationChecklist,
    },

    <Dialog open={open} onOpenChange=
        <DialogHeader>
            {strategy.name}
      
      
            <div key={index}
              <div className="space-y-2">
                  {section.icon}
      
      
              </div>
          ))}

      
      
            <Button onClick={onV
            </Button>
        </div>
    </
}














































