import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkle, Lightbulb, ChatsCircle, Palette, Target, ArrowClockwise } from "@phosphor-icons/react"
import { ResultCard } from "@/components/ResultCard"
import { LoadingState } from "@/components/LoadingState"
import { EmptyState } from "@/components/EmptyState"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { motion } from "framer-motion"

interface MarketingResult {
  marketingCopy: string
  visualStrategy: string
  targetAudience: string
}

function App() {
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useKV<MarketingResult | null>("last-result", null)
  const [error, setError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const isValidInput = description.trim().length >= 10
  const charCount = description.length
  const showCharCounter = charCount >= 900

  const generateMarketing = async () => {
    if (!isValidInput) {
      toast.error("Please enter at least 10 characters")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const prompt = spark.llmPrompt`You are an expert marketing strategist. Based on the following product or service description, generate a comprehensive marketing strategy.

Product/Service Description: ${description}

Return your response as a valid JSON object with exactly three properties:
1. "marketingCopy" - Persuasive, engaging marketing copy (2-3 paragraphs) that highlights benefits, creates desire, and includes a compelling call-to-action
2. "visualStrategy" - Detailed visual strategy recommendations including suggested imagery, colors, design motifs, mood, and overall aesthetic direction
3. "targetAudience" - Specific recommendation for the ideal target audience including demographics, psychographics, pain points, and why they need this product/service

Make the content professional, actionable, and inspiring. Be specific and creative.`

      const response = await spark.llm(prompt, "gpt-4o", true)
      const parsedResult = JSON.parse(response) as MarketingResult

      setResult(parsedResult)
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (err) {
      console.error("Error generating marketing:", err)
      setError("Failed to generate marketing strategy. Please try again.")
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewGeneration = () => {
    setDescription("")
    setResult(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isValidInput) {
      e.preventDefault()
      generateMarketing()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_oklch(0.75_0.15_195_/_0.15)_0%,_transparent_50%),radial-gradient(circle_at_70%_80%,_oklch(0.45_0.18_290_/_0.12)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkle size={40} weight="duotone" className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Techpigeon Assistant
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your product ideas into powerful marketing strategies with AI-driven insights
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-6 md:p-8 mb-8"
        >
          <label htmlFor="product-description" className="block text-sm font-semibold text-foreground mb-3">
            Describe your product or service
          </label>
          <Textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="e.g., A smart water bottle that tracks hydration levels and syncs with fitness apps..."
            className="min-h-32 mb-4 resize-none text-base leading-relaxed focus:ring-2 focus:ring-accent transition-all"
            maxLength={1000}
          />
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {showCharCounter && (
                <span className={charCount >= 1000 ? "text-destructive font-medium" : ""}>
                  {charCount}/1000
                </span>
              )}
              {isValidInput && (
                <span className="text-xs opacity-70">
                  Press ⌘+Enter to generate
                </span>
              )}
            </div>
            
            <Button
              onClick={generateMarketing}
              disabled={!isValidInput || isLoading}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>Generating...</>
              ) : (
                <>
                  <Lightbulb weight="duotone" size={20} />
                  Generate Strategy
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-8 text-center"
          >
            <p className="text-destructive font-medium mb-3">{error}</p>
            <Button onClick={generateMarketing} variant="outline" size="sm">
              Try Again
            </Button>
          </motion.div>
        )}

        <div ref={resultsRef}>
          {isLoading && <LoadingState />}
          
          {!isLoading && result && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground">Your Marketing Strategy</h2>
                <Button onClick={handleNewGeneration} variant="outline" size="sm" className="gap-2">
                  <ArrowClockwise weight="bold" size={16} />
                  New Strategy
                </Button>
              </div>
              
              <ResultCard
                title="Marketing Copy"
                icon={<ChatsCircle size={24} weight="duotone" />}
                content={result.marketingCopy}
                delay={0}
              />
              
              <ResultCard
                title="Visual Strategy"
                icon={<Palette size={24} weight="duotone" />}
                content={result.visualStrategy}
                delay={0.1}
              />
              
              <ResultCard
                title="Target Audience"
                icon={<Target size={24} weight="duotone" />}
                content={result.targetAudience}
                delay={0.2}
              />
            </div>
          )}
          
          {!isLoading && !result && !error && <EmptyState />}
        </div>
      </div>
    </div>
  )
}

export default App