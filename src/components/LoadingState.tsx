import { motion } from "framer-motion"

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-card rounded-xl p-6 border border-border/50 overflow-hidden relative"
        >
          <div className="space-y-3">
            <div className="h-6 bg-secondary rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-secondary rounded w-full animate-pulse" />
            <div className="h-4 bg-secondary rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-secondary rounded w-4/6 animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      ))}
    </motion.div>
  )
}
