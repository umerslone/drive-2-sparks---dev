import { MarketingResult, UserProfile } from "@/types"
import { neonKVSet, neonKVGet, neonKVDelete, neonKVKeys } from "@/lib/kv-sync"

type SparkKV = {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  keys?: () => Promise<string[]>
}

type SparkClient = {
  kv?: SparkKV
  llmPrompt?: (strings: TemplateStringsArray, ...values: unknown[]) => unknown
  llm?: (prompt: unknown, model?: string, parseJson?: boolean) => Promise<string>
  user?: () => Promise<UserProfile>
}

const memoryStore = new Map<string, unknown>()
const STORAGE_PREFIX = "spark-fallback-"

const safeGlobalSpark = (): SparkClient | undefined => {
  if (typeof window === "undefined") return undefined
  return (window as unknown as { spark?: SparkClient }).spark
}

const readCached = <T>(key: string): T | undefined => {
  if (memoryStore.has(key)) {
    return memoryStore.get(key) as T
  }

  if (typeof window === "undefined") return undefined

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (raw != null) {
      return JSON.parse(raw) as T
    }
  } catch {
    // Ignore storage errors and fall through to undefined
  }

  return undefined
}

const writeCached = (key: string, value: unknown) => {
  memoryStore.set(key, value)

  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // Ignore storage write errors in restricted environments
  }
}

const deleteCached = (key: string) => {
  memoryStore.delete(key)

  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  } catch {
    // Ignore storage delete errors
  }
}

const buildSafeKV = (baseKV?: SparkKV): Required<SparkKV> => {
  return {
    async get<T>(key: string) {
      // Tier 1: Spark KV (if running in Spark runtime)
      if (baseKV) {
        try {
          const result = await baseKV.get<T>(key)
          if (result !== undefined) {
            writeCached(key, result)
            return result
          }
        } catch (error) {
          console.warn("Spark KV get failed, using fallback cache", error)
        }
      }

      // Tier 2: localStorage cache
      const cached = readCached<T>(key)
      if (cached !== undefined) return cached

      // Tier 3: Neon DB (cloud persistence)
      try {
        const neonResult = await neonKVGet<T>(key)
        if (neonResult !== undefined) {
          writeCached(key, neonResult) // Cache locally for next read
          return neonResult
        }
      } catch {
        // Non-blocking — Neon may not be configured
      }

      return undefined
    },
    async set<T>(key: string, value: T) {
      // Write to local cache immediately (fast)
      writeCached(key, value)

      // Write-through to Spark KV
      if (baseKV) {
        try {
          await baseKV.set(key, value)
        } catch (error) {
          console.warn("Spark KV set failed, value cached locally", error)
        }
      }

      // Write-through to Neon DB (non-blocking)
      neonKVSet(key, value).catch(() => {})
    },
    async delete(key: string) {
      deleteCached(key)

      if (baseKV) {
        try {
          await baseKV.delete(key)
        } catch (error) {
          console.warn("Spark KV delete failed, cleared local cache only", error)
        }
      }

      // Delete from Neon (non-blocking)
      neonKVDelete(key).catch(() => {})
    },
    async keys() {
      const localKeys = Array.from(memoryStore.keys())

      if (baseKV?.keys) {
        try {
          const remoteKeys = await baseKV.keys()
          return Array.from(new Set([...(remoteKeys || []), ...localKeys]))
        } catch (error) {
          console.warn("Spark KV keys failed, returning local keys", error)
        }
      }

      // Also include Neon keys
      try {
        const neonKeys = await neonKVKeys()
        if (neonKeys.length > 0) {
          return Array.from(new Set([...localKeys, ...neonKeys]))
        }
      } catch {
        // Non-blocking
      }

      return localKeys
    },
  }
}

const extractTopicFromPrompt = (prompt: unknown): string => {
  const text = String(prompt || "").trim()
  if (!text) return "your product"

  const topicMatch = text.match(/Topic:\s*([^\n]+)/i)
  if (topicMatch?.[1]) {
    return topicMatch[1].trim().slice(0, 140)
  }

  return text.slice(0, 140)
}

const buildFallbackLLMResult = (topic: string, includeNotice = false): MarketingResult => ({
  marketingCopy: includeNotice
    ? `Launch ${topic} with a trust-first narrative focused on measurable outcomes, customer proof, and clear value messaging. Note: generated in fallback mode while live AI runtime is unavailable.`
    : `Launch ${topic} with a trust-first narrative focused on measurable outcomes, customer proof, and clear value messaging.`,
  visualStrategy: `Use a high-contrast accessible palette, one strong display font with a readable body pair, and a modular component style that keeps dashboards, landing pages, and onboarding visually consistent for ${topic}.`,
  targetAudience: `Primary segment: decision-makers with urgent workflow pain. Secondary segment: operators who execute daily tasks. Prioritize use-cases with clear ROI in the first 30 days for ${topic}.`,
  applicationWorkflow: `Phase 1: define acceptance criteria and KPI baseline. Phase 2: build core user flow and API contracts. Phase 3: run QA and release with instrumentation.`,
  uiWorkflow: `Map the user journey from discovery to activation, reduce friction in first-session setup, and keep key actions visible with consistent navigation and feedback states.`,
  databaseWorkflow: `Start with users, organizations/projects, events, and strategy_assets tables. Add foreign keys, created_at/updated_at fields, and indexes on status, owner_id, and created_at.`,
  mobileWorkflow: `Use React Native with shared API client and token refresh flow. Build offline-friendly list/detail screens first, then add push notifications and analytics events.`,
  implementationChecklist: `1) Define KPIs and owner map. 2) Finalize schema + migrations. 3) Implement core flows and tests. 4) QA + security pass. 5) Release and monitor adoption metrics.`,
})

const allowMockLLMFallback =
  String(import.meta.env?.VITE_ENABLE_MOCK_LLM_FALLBACK || "").toLowerCase() === "true"

const fallbackPrompt: SparkClient["llmPrompt"] = (strings: TemplateStringsArray, ...values: unknown[]) => {
  let output = ""
  strings.forEach((chunk, index) => {
    output += chunk
    if (index < values.length) {
      output += String(values[index] ?? "")
    }
  })
  return output
}

const fallbackLLM: SparkClient["llm"] = async (prompt: unknown) => {
  const topic = extractTopicFromPrompt(prompt)
  return JSON.stringify(buildFallbackLLMResult(topic, !allowMockLLMFallback))
}

const fallbackUser: SparkClient["user"] = async () => {
  const currentUserId = readCached<string>("current-user-id")
  const users = readCached<Record<string, UserProfile>>("platform-users")

  if (currentUserId && users?.[currentUserId]) {
    return users[currentUserId]
  }

  return {
    id: "local-user",
    email: "local@example.com",
    fullName: "Local User",
    role: "admin",
    subscription: {
      plan: "basic",
      status: "active",
      proCredits: 0,
      updatedAt: Date.now(),
    },
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  }
}

export const initializeSparkShim = () => {
  if (typeof window === "undefined") return

  const baseSpark = safeGlobalSpark() || {}
  const safeKV = buildSafeKV(baseSpark.kv)

  const safeSpark: SparkClient = {
    ...baseSpark,
    kv: safeKV,
    llmPrompt: baseSpark.llmPrompt || fallbackPrompt,
    llm: async (prompt: unknown, model?: string, parseJson?: boolean) => {
      if (baseSpark.llm) {
        try {
          return await baseSpark.llm(prompt, model ?? "gpt-4o-mini", parseJson ?? true)
        } catch (error) {
          console.warn("Spark LLM failed, using resilient fallback generator", error)
        }
      }
      return (fallbackLLM as (prompt: unknown) => Promise<string>)(prompt)
    },
    user: baseSpark.user || fallbackUser,
  }

  ;(window as unknown as { spark: SparkClient }).spark = safeSpark

  // Mark whether we're running in real Spark runtime (has native user())
  if (baseSpark.user) {
    ;(window as unknown as { __SPARK_RUNTIME__: boolean }).__SPARK_RUNTIME__ = true
  }
}

export const getSafeKVClient = (): Required<SparkKV> => {
  const sparkClient = safeGlobalSpark()
  if (sparkClient?.kv) {
    return sparkClient.kv as Required<SparkKV>
  }
  return buildSafeKV(undefined)
}
