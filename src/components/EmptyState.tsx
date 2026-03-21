import { Lightbulb, Sparkle, MagnifyingGlass, PencilLine, Rocket, ChartBar, Target } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import faviconImg from "@/assets/images/favicon.png"

const modules = [
  { icon: Target, label: "Strategy Engine", color: "text-primary" },
  { icon: Sparkle, label: "Idea Generation", color: "text-accent" },
  { icon: MagnifyingGlass, label: "Integrity Checker", color: "text-emerald-500" },
  { icon: PencilLine, label: "Humanizer", color: "text-violet-500" },
  { icon: Rocket, label: "Pitch Deck & Canvas", color: "text-rose-500" },
  { icon: ChartBar, label: "Analytics Dashboard", color: "text-sky-500" },
]

const examplePrompts = [
  "Launch strategy for an AI-powered SaaS product targeting healthcare",
  "Business canvas for a sustainable fashion e-commerce startup",
  "Go-to-market plan for a fintech mobile app in emerging markets",
  "Growth strategy for an EdTech platform offering coding bootcamps",
]

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-6"
      >
        <img src={faviconImg} alt="Techpigeon" className="w-10 h-10 object-contain" />
      </motion.div>

      <h3 className="text-2xl font-bold mb-3 text-foreground">
        Ready to power your next big idea?
      </h3>
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
        Describe your product, service, or business concept above — Techpigeon AI will generate strategies,
        business models, pitch decks, integrity-checked content, and actionable implementation workflows.
      </p>

      {/* Animated modules showcase */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-xl mx-auto">
        {modules.map((mod, i) => {
          const Icon = mod.icon
          return (
            <motion.div
              key={mod.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
              className="flex items-center gap-1.5 bg-card/80 border border-border/40 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm"
            >
              <Icon size={16} weight="duotone" className={mod.color} />
              <span className="text-foreground/80">{mod.label}</span>
            </motion.div>
          )
        })}
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Try these examples:
        </p>
        {examplePrompts.map((prompt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
            className="text-sm text-foreground/70 bg-secondary/50 rounded-lg px-4 py-3 border border-border/30 text-left"
          >
            <Lightbulb size={14} weight="duotone" className="text-accent inline mr-2 -mt-0.5" />
            {prompt}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
