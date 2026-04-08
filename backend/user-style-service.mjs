/**
 * User Style Profile Service
 * 
 * Tracks user generation history and infers style preferences.
 * Computes aggregated profiles used to personalize future generations.
 */

import { neon } from "@neondatabase/serverless"

let _sql = null

function getSql() {
  if (_sql) return _sql
  const url = process.env.NEON_DATABASE_URL
  if (!url) {
    throw new Error("NEON_DATABASE_URL not configured for user style profiles")
  }
  _sql = neon(url)
  return _sql
}

/**
 * Log a generation insight for later analysis
 * @param {Object} input
 * @param {string} input.userId
 * @param {string} input.conceptMode
 * @param {string} input.tonePreference
 * @param {string} input.audienceLevel
 * @param {number} input.estimatedSatisfaction
 * @param {string[]} input.sectionsEdited
 * @param {number} [input.qualityScore]
 * @param {number} [input.costCents]
 * @param {string} [input.providerUsed]
 * @param {string} [input.modelUsed]
 * @param {string} [input.queryPreview]
 * @param {boolean} [input.wasSaved]
 * @param {Object} [input.metadata]
 */
export async function logGenerationInsight(input) {
  if (!process.env.NEON_DATABASE_URL) return

  try {
    const sql = getSql()

    await sql`
      INSERT INTO generation_insights (
        user_id,
        concept_mode,
        tone_preference,
        audience_level,
        estimated_satisfaction,
        sections_edited,
        quality_score,
        cost_cents,
        provider_used,
        model_used,
        query_preview,
        was_saved,
        metadata
      ) VALUES (
        ${input.userId},
        ${input.conceptMode},
        ${input.tonePreference},
        ${input.audienceLevel},
        ${input.estimatedSatisfaction},
        ${JSON.stringify(input.sectionsEdited)},
        ${input.qualityScore ?? null},
        ${input.costCents ?? null},
        ${input.providerUsed ?? null},
        ${input.modelUsed ?? null},
        ${input.queryPreview ?? null},
        ${input.wasSaved ?? false},
        ${JSON.stringify(input.metadata ?? {})}
      )
    `
  } catch (error) {
    console.error("Failed to log generation insight:", error)
  }
}

/**
 * Record user feedback on a generated strategy
 * @param {Object} input
 * @param {string} input.userId
 * @param {number} [input.generationId]
 * @param {number} input.qualityRating
 * @param {number} [input.toneFit]
 * @param {number} [input.audienceMatch]
 * @param {number} [input.originality]
 * @param {string} [input.comment]
 * @param {boolean} [input.usedInProduction]
 * @param {string} [input.outcomeMetric]
 * @param {number} [input.outcomeValue]
 */
export async function recordStyleFeedback(input) {
  if (!process.env.NEON_DATABASE_URL) return

  try {
    const sql = getSql()

    await sql`
      INSERT INTO user_style_feedback (
        user_id,
        generation_id,
        quality_rating,
        tone_fit,
        audience_match,
        originality,
        comment,
        used_in_production,
        outcome_metric,
        outcome_value
      ) VALUES (
        ${input.userId},
        ${input.generationId ?? null},
        ${input.qualityRating},
        ${input.toneFit ?? null},
        ${input.audienceMatch ?? null},
        ${input.originality ?? null},
        ${input.comment ?? null},
        ${input.usedInProduction ?? false},
        ${input.outcomeMetric ?? null},
        ${input.outcomeValue ?? null}
      )
    `
  } catch (error) {
    console.error("Failed to record style feedback:", error)
  }
}

/**
 * Infer user style profile from recent generations
 * @param {string} userId
 * @returns {Promise<Object>}
 */
async function inferUserProfile(userId) {
  if (!process.env.NEON_DATABASE_URL) {
    return {
      userId,
      preferredIndustries: [],
      dominantTone: "professional",
      audienceLevel: "intermediate",
      frequentEdits: [],
      avgQualityScore: 75
    }
  }

  try {
    const sql = getSql()

    // Fetch recent 50 generations for this user
    const insights = await sql`
      SELECT
        concept_mode,
        tone_preference,
        audience_level,
        sections_edited,
        quality_score,
        estimated_satisfaction,
        was_saved
      FROM generation_insights
      WHERE user_id = ${userId}
      ORDER BY tracked_at DESC
      LIMIT 50
    `

    if (!insights || insights.length === 0) {
      return {
        userId,
        preferredIndustries: [],
        dominantTone: "professional",
        audienceLevel: "intermediate",
        frequentEdits: [],
        avgQualityScore: 75
      }
    }

    // Compute preferred industries
    const industryMap = new Map()
    insights.forEach(insight => {
      const count = industryMap.get(insight.concept_mode) || 0
      industryMap.set(insight.concept_mode, count + 1)
    })
    const preferredIndustries = Array.from(industryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([industry, count]) => ({ industry, count }))

    // Compute dominant tone
    const toneMap = new Map()
    insights.forEach(insight => {
      const count = toneMap.get(insight.tone_preference) || 0
      toneMap.set(insight.tone_preference, count + 1)
    })
    const dominantTone =
      Array.from(toneMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "professional"

    // Compute audience level
    const audienceLevelMap = { beginner: 1, intermediate: 2, expert: 3 }
    const avgAudienceScore =
      insights.reduce((sum, i) => sum + (audienceLevelMap[i.audience_level] || 2), 0) /
      insights.length
    const dominantAudienceLevel =
      avgAudienceScore < 1.5
        ? "beginner"
        : avgAudienceScore < 2.5
          ? "intermediate"
          : "expert"

    // Compute frequent edits
    const editMap = new Map()
    insights.forEach(insight => {
      if (Array.isArray(insight.sections_edited)) {
        insight.sections_edited.forEach(section => {
          const count = editMap.get(section) || 0
          editMap.set(section, count + 1)
        })
      }
    })
    const frequentEdits = Array.from(editMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([section, count]) => ({ section, count }))

    // Compute average quality score
    const validScores = insights
      .filter(i => i.quality_score !== null && i.quality_score !== undefined)
      .map(i => i.quality_score)
    const avgQualityScore =
      validScores.length > 0
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length
        : 75

    return {
      userId,
      preferredIndustries,
      dominantTone,
      audienceLevel: dominantAudienceLevel,
      frequentEdits,
      avgQualityScore: Math.round(avgQualityScore * 100) / 100
    }
  } catch (error) {
    console.error("Failed to infer user profile:", error)
    return {
      userId,
      preferredIndustries: [],
      dominantTone: "professional",
      audienceLevel: "intermediate",
      frequentEdits: [],
      avgQualityScore: 75
    }
  }
}

/**
 * Get or build cached user style profile
 * @param {string} userId
 * @param {boolean} [forcRefresh]
 * @returns {Promise<Object>}
 */
export async function getOrBuildUserProfile(userId, forcRefresh = false) {
  if (!process.env.NEON_DATABASE_URL) {
    return {
      userId,
      preferredIndustries: [],
      dominantTone: "professional",
      audienceLevel: "intermediate",
      frequentEdits: [],
      avgQualityScore: 75
    }
  }

  try {
    const sql = getSql()

    // Check if profile exists and is fresh (< 1 hour old)
    const existing = await sql`
      SELECT
        preferred_industries,
        dominant_tone,
        audience_level,
        frequent_edits,
        avg_quality_score,
        total_generations,
        updated_at
      FROM user_style_profiles
      WHERE user_id = ${userId}
    `

    const profile = existing?.[0]
    const now = Date.now()
    const lastUpdate = profile?.updated_at ? new Date(profile.updated_at).getTime() : 0
    const isStale = (now - lastUpdate) > (60 * 60 * 1000)

    if (!forcRefresh && profile && !isStale) {
      return {
        userId,
        preferredIndustries: profile.preferred_industries || [],
        dominantTone: profile.dominant_tone || "professional",
        audienceLevel: profile.audience_level || "intermediate",
        frequentEdits: profile.frequent_edits || [],
        avgQualityScore: profile.avg_quality_score || 75
      }
    }

    // Recompute profile
    const inferred = await inferUserProfile(userId)

    // Upsert into user_style_profiles
    await sql`
      INSERT INTO user_style_profiles (
        user_id,
        preferred_industries,
        dominant_tone,
        audience_level,
        frequent_edits,
        avg_quality_score,
        total_generations,
        updated_at
      ) VALUES (
        ${userId},
        ${JSON.stringify(inferred.preferredIndustries)},
        ${inferred.dominantTone},
        ${inferred.audienceLevel},
        ${JSON.stringify(inferred.frequentEdits)},
        ${inferred.avgQualityScore},
        ${existing?.[0]?.total_generations || 0},
        now()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        preferred_industries = EXCLUDED.preferred_industries,
        dominant_tone = EXCLUDED.dominant_tone,
        audience_level = EXCLUDED.audience_level,
        frequent_edits = EXCLUDED.frequent_edits,
        avg_quality_score = EXCLUDED.avg_quality_score,
        updated_at = now()
    `

    return inferred
  } catch (error) {
    console.error("Failed to get/build user profile:", error)
    return {
      userId,
      preferredIndustries: [],
      dominantTone: "professional",
      audienceLevel: "intermediate",
      frequentEdits: [],
      avgQualityScore: 75
    }
  }
}

/**
 * Inject user style hints into a base prompt
 * @param {string} basePrompt
 * @param {Object} profile
 * @returns {string}
 */
export function injectStyleHints(basePrompt, profile) {
  if (!profile || !profile.preferredIndustries || profile.preferredIndustries.length === 0) {
    return basePrompt
  }

  const styleContext = [
    "# User Style Profile Hints",
    `Based on user's generation history:`,
    `- Preferred industries: ${profile.preferredIndustries.map(p => p.industry).join(", ")}`,
    `- Preferred tone: ${profile.dominantTone}`,
    `- Target audience level: ${profile.audienceLevel}`,
    `- Average quality score: ${profile.avgQualityScore}/100`
  ].join("\n")

  return `${styleContext}\n\n${basePrompt}`
}

/**
 * Batch recompute all user profiles
 * @param {number} [limit]
 * @returns {Promise<void>}
 */
export async function recomputeAllUserProfiles(limit = 100) {
  if (!process.env.NEON_DATABASE_URL) return

  try {
    const sql = getSql()

    // Get users with stale profiles or no profile yet
    const users = await sql`
      SELECT DISTINCT user_id
      FROM generation_insights
      WHERE user_id NOT IN (
        SELECT user_id FROM user_style_profiles
        WHERE updated_at > now() - interval '1 hour'
      )
      ORDER BY user_id DESC
      LIMIT ${limit}
    `

    for (const { user_id } of users) {
      await getOrBuildUserProfile(user_id, true)
    }

    console.log(`[UserStyleProfileService] Recomputed ${users.length} user profiles`)
  } catch (error) {
    console.error("Failed to recompute user profiles:", error)
  }
}
