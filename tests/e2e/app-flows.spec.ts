import { expect, test } from "@playwright/test"

async function installSparkMock(
  page: { addInitScript: (fn: (...args: unknown[]) => void, arg: unknown) => Promise<void> },
  seed: { id: string; email: string; fullName: string; role: "client" | "admin" }
) {
  await page.addInitScript((injectedSeed) => {
    const kvStore = {}

    const defaultSubscription = {
      plan: "basic",
      status: "active",
      proCredits: 0,
      updatedAt: Date.now(),
    }

    const userRecord = {
      id: injectedSeed.id,
      email: injectedSeed.email,
      fullName: injectedSeed.fullName,
      role: injectedSeed.role,
      subscription: defaultSubscription,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    }

    kvStore["platform-users"] = {
      [injectedSeed.id]: userRecord,
    }
    kvStore["current-user-id"] = injectedSeed.id

    window.spark = {
      kv: {
        async get(key) {
          return key in kvStore ? kvStore[key] : null
        },
        async set(key, value) {
          kvStore[key] = value
        },
        async delete(key) {
          delete kvStore[key]
        },
      },
      async user() {
        return {
          id: injectedSeed.id,
          login: injectedSeed.fullName.toLowerCase().replace(/\s+/g, "-"),
          email: injectedSeed.email,
          avatarUrl: "",
          isOwner: injectedSeed.role === "admin",
        }
      },
      llmPrompt(strings, ...values) {
        let output = ""
        for (let i = 0; i < strings.length; i += 1) {
          output += strings[i]
          if (i < values.length) output += String(values[i] ?? "")
        }
        return output
      },
      async llm(prompt) {
        const lower = String(prompt).toLowerCase()

        if (lower.includes("business model canvas") || lower.includes("keypartners")) {
          return JSON.stringify({
            keyPartners: "Channel partners and fulfillment providers.",
            keyActivities: "Customer acquisition and delivery operations.",
            keyResources: "Brand, app stack, and support team.",
            valueProposition: "Faster, cheaper access for target customers.",
            customerRelationships: "Self-serve onboarding with live support.",
            channels: "Organic search, referrals, and direct outreach.",
            customerSegments: "SMBs in growth phase.",
            costStructure: "Cloud costs, support payroll, and ads.",
            revenueStreams: "Monthly subscriptions and premium add-ons.",
          })
        }

        if (lower.includes("pitch deck") || lower.includes("slides")) {
          return JSON.stringify({
            executiveSummary: "An execution-ready business with a clear monetization path.",
            slides: [
              { slideNumber: 1, title: "Problem", content: "Customers face fragmented processes.", notes: "Open with urgency." },
              { slideNumber: 2, title: "Solution", content: "Unified workflow platform.", notes: "Show core flow." },
              { slideNumber: 3, title: "Market Opportunity", content: "Large underserved TAM.", notes: "Anchor with segment." },
              { slideNumber: 4, title: "Product/Service", content: "Automation-first product stack.", notes: "Demo key screens." },
              { slideNumber: 5, title: "Business Model", content: "SaaS subscription tiers.", notes: "Explain pricing." },
              { slideNumber: 6, title: "Go-to-Market Strategy", content: "Partner-led distribution.", notes: "Outline channels." },
              { slideNumber: 7, title: "Competitive Advantage", content: "Data flywheel and execution speed.", notes: "Defensibility." },
              { slideNumber: 8, title: "Financial Projections & Ask", content: "18-month runway ask.", notes: "Close confidently." },
            ],
          })
        }

        if (lower.includes("strict quality gate") && lower.includes("score")) {
          return JSON.stringify({ pass: true, score: 92, summary: "Looks strong", issues: [] })
        }

        return JSON.stringify({
          refinedIdea: "Refined B2B idea with clear target user.",
          marketOpportunity: "Growing segment with weak incumbents.",
          competitiveAdvantage: "Faster implementation and lower cost.",
          targetMarket: "SMBs with 5-50 employees.",
          revenueModel: "Subscription + onboarding fees.",
          keyInsights: ["Strong demand", "Clear pain"],
          keyRisks: ["Execution risk"],
          nextSteps: ["Pilot", "Collect feedback"],
        })
      },
    }
  }, seed)
}

test("client can access core tabs and feature controls", async ({ page }) => {
  await installSparkMock(page, { id: "user-e2e-1", email: "qa@example.com", fullName: "QA User", role: "client" })

  await page.goto("/")

  await expect(page.getByText("AI-Powered Techpigeon Assistant")).toBeVisible()

  await page.getByRole("tab", { name: "Strategy" }).click()
  await expect(page.getByRole("button", { name: "Generate Strategy" })).toBeVisible()

  await page.getByRole("tab", { name: "Ideas" }).click()

  const ideaInput = page.locator("#idea-input")
  await ideaInput.fill("An AI workflow assistant for local service businesses")
  await expect(page.getByRole("button", { name: "Cook My Idea" })).toBeEnabled()

  await page.getByRole("tab", { name: /Saved/ }).first().click()
  await expect(page.getByText(/Saved/i).first()).toBeVisible()

  await page.getByRole("tab", { name: "Review" }).click()
  await expect(page.locator("#plagiarism-text")).toBeVisible()
  await expect(page.getByRole("button", { name: /Run Integrity Check/i })).toBeVisible()

  await page.getByRole("tab", { name: "Dashboard" }).click()
  await expect(page.getByText("Your Dashboard")).toBeVisible()
})

test("admin tab is visible for admin role", async ({ page }) => {
  await installSparkMock(page, { id: "user-e2e-admin", email: "admin@example.com", fullName: "Admin User", role: "admin" })

  await page.goto("/")

  await expect(page.getByRole("tab", { name: "Admin" })).toBeVisible()
  await page.getByRole("tab", { name: "Admin" }).click()
  await expect(page.getByText("Admin Dashboard")).toBeVisible()
})
