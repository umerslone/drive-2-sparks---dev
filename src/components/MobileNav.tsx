import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { List, Lightbulb, Sparkle, MagnifyingGlass, ChartBar, FolderOpen, ShieldCheck, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isAdmin: boolean
  savedCount: number
}

export function MobileNav({ activeTab, onTabChange, isAdmin, savedCount }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleTabSelect = (tab: string) => {
    onTabChange(tab)
    setOpen(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.div
          className="md:hidden fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground border-2 border-primary-foreground/30"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={28} weight="bold" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <List size={28} weight="bold" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkle size={24} weight="duotone" className="text-primary" />
            Navigation Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.value
            return (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-14 text-base font-medium transition-all",
                    isActive && "bg-primary text-primary-foreground shadow-md"
                  )}
                  onClick={() => handleTabSelect(item.value)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                    isActive ? "bg-primary-foreground/20" : "bg-secondary/40"
                  )}>
                    <Icon size={20} weight={isActive ? "fill" : "bold"} />
                  </div>
                  {item.label}
                </Button>
              </motion.div>
            )
          })}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-xs text-muted-foreground text-center p-4 bg-secondary/20 rounded-lg">
            <p className="font-medium">Techpigeon Assistant</p>
            <p className="mt-1">Pakistan's AI Platform</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
