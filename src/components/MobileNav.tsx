import { Lightbulb, Sparkle, MagnifyingGlass, ChartBar, FolderOpen, ShieldCheck } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isAdmin: boolean
  savedCount: number
}

export function MobileNav({ activeTab, onTabChange, isAdmin, savedCount }: MobileNavProps) {
  const handleTabSelect = (tab: string) => {
    onTabChange(tab)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navItems = [
    { value: "generate", label: "Strategy", icon: Lightbulb },
    { value: "ideas", label: "Ideas", icon: Sparkle },
    { value: "plagiarism", label: "Review", icon: MagnifyingGlass },
    { value: "dashboard", label: "Dashboard", icon: ChartBar },
    { value: "saved", label: `Saved (${savedCount})`, icon: FolderOpen },
  ]

  if (isAdmin) {
    navItems.push({ value: "admin", label: "Admin", icon: ShieldCheck })
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <nav className="flex items-center justify-around p-2 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.value
          
          return (
            <Button
              key={item.value}
              onClick={() => handleTabSelect(item.value)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1 flex-col h-auto py-2 gap-1 text-xs",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              <span className="truncate max-w-full">{item.label}</span>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
