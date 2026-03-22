import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/butto
import { Separator } from "@/components/ui/sepa
import { ChatsCircle, Palette, Target, Code, Desktop, Da
interface StrategyPreviewProps {
  onOpenChange: (open: boolean) => void
  onViewFull?: () => void

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
      title: "UI Workflow", 
      
    { 
      content: strategy.result.databa
    },
      title: "Mobile Workflow", 
      
    { 
      content: strategy.resu
    },

    if
    re

    <Dialog open={open} onOpenChange={onOpenChan
        <DialogHeader>
      
      
          </DialogTitle>

          <div className="space-y-6">
      
      
                    {section.title}
                </div>
                  {truncateText(section.content, 300)}
      
   

        <div className="flex items-center justify-between gap
            Preview showing first 300 charact
          {onViewFull && (
   

          
              View Full Strategy
          )}
      </DialogContent>
  )














































