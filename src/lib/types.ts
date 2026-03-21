export type StrategyStatus = 'draft' | 'active' | 'archived'

export interface Strategy {
  id: string
  title: string
  description: string
  goals: string
  budget: number
  timeline: string
  owner: string
  status: StrategyStatus
  createdAt: number
  updatedAt: number
}

export interface Idea {
  id: string
  title: string
  description: string
  source: 'user' | 'llm'
  createdAt: number
}

export interface PlagiarismResult {
  strategyId: string
  strategyTitle: string
  similarityScore: number
  matchingPhrases: string[]
}

export interface BudgetAllocation {
  strategyId: string
  strategyTitle: string
  allocated: number
  spent: number
}
