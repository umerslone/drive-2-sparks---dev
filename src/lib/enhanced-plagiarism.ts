/**
 * Enhanced Plagiarism Check Integration
 * Combines LLM-based detection with advanced algorithmic analysis
 */

import { performAdvancedDetection } from "./advanced-detection"
import { PlagiarismResult } from "@/types"

export async function performEnhancedPlagiarismCheck(
  text: string,
  spark: any
): Promise<{ result: PlagiarismResult; advancedMetrics: any }> {
  // First, run advanced detection algorithms locally
  const advancedMetrics = performAdvancedDetection(text)
  
  // Then enhance with LLM-based analysis
  const prompt = spark.llmPrompt`You are an elite plagiarism detection and AI content detection system trained on the world's most sophisticated detection models.

Text to analyze (${text.length} characters):
${text}

CRITICAL ANALYSIS REQUIREMENTS:
1. Detect ALL plagiarism using semantic matching, paraphrase detection, and source matching
2. Detect AI-generated content using advanced stylometry, entropy analysis, and pattern recognition
3. Identify specific phrases that are copied, paraphrased, or generated
4. Rate Turnitin readiness based on the most stringent standards
5. Validate all citations and references
6. Identify suspicious patterns that indicate plagiarism or AI use

ADVANCED DETECTION FEATURES:
- Entropy anomalies (${advancedMetrics.entropyScore}%)
- Burstiness patterns (${advancedMetrics.burstinessScore}%)
- Stylometric inconsistencies (${advancedMetrics.stylometricScore}%)
- Repetition patterns (${advancedMetrics.repetitionPatternScore}%)
- Semantic consistency (${advancedMetrics.semanticConsistencyScore}%)

Return ONLY a valid JSON object with NO markdown, NO code blocks, NO text before or after.

{
  "overallScore": <0-100, higher is more original>,
  "plagiarismPercentage": <0-100>,
  "aiContentPercentage": <0-100>,
  "highlights": [
    {
      "text": "<suspected passage>",
      "startIndex": <position>,
      "endIndex": <position>,
      "severity": "<high|medium|low>",
      "source": "<source if identified>",
      "confidence": <0-100>
    }
  ],
  "aiHighlights": [
    {
      "text": "<AI-likely passage>",
      "startIndex": <position>,
      "endIndex": <position>,
      "confidence": <0-100>,
      "indicators": ["<indicator1>", "<indicator2>"]
    }
  ],
  "summary": "<comprehensive analysis>",
  "recommendations": ["<rec1>", "<rec2>"],
  "turnitinReady": <boolean>,
  "validReferences": [
    {
      "reference": "<ref text>",
      "isValid": <boolean>,
      "reason": "<why>"
    }
  ],
  "detectedSources": [
    {
      "source": "<source>",
      "similarity": <0-100>,
      "confidence": <0-100>
    }
  ],
  "enhancedMetrics": {
    "aiProbability": ${advancedMetrics.aiProbability},
    "plagiarismProbability": ${advancedMetrics.plagiarismProbability},
    "integrityScore": ${advancedMetrics.integrityScore},
    "confidenceLevel": "${advancedMetrics.confidenceLevel}",
    "riskFactors": ${JSON.stringify(advancedMetrics.riskFactors)}
  }
}`

  const response = await spark.llm(prompt, "gpt-4o", true)
  
  let cleanedResponse = response.trim()
  if (cleanedResponse.startsWith("```json")) {
    cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/```\s*$/, "")
  } else if (cleanedResponse.startsWith("```")) {
    cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/```\s*$/, "")
  }
  
  cleanedResponse = cleanedResponse.trim()
  
  const firstBrace = cleanedResponse.indexOf('{')
  const lastBrace = cleanedResponse.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1)
  }
  
  const parsedResult = JSON.parse(cleanedResponse) as PlagiarismResult
  
  // Enhance results with advanced metrics
  const enhancedResult: PlagiarismResult = {
    ...parsedResult,
    // Boost scores if advanced detection confirms issues
    aiContentPercentage: Math.max(
      parsedResult.aiContentPercentage,
      Math.round(advancedMetrics.aiProbability * 0.9)
    ),
    plagiarismPercentage: Math.max(
      parsedResult.plagiarismPercentage,
      Math.round(advancedMetrics.plagiarismProbability * 0.85)
    ),
    // Adjust overall score based on combined analysis
    overallScore: Math.min(
      Math.max(
        100 - (
          Math.round(advancedMetrics.aiProbability * 0.35) +
          Math.round(advancedMetrics.plagiarismProbability * 0.65)
        ),
        0
      ),
      100
    ),
    // Add advanced recommendations
    recommendations: [
      ...parsedResult.recommendations,
      ...(advancedMetrics.riskFactors.length > 0 ? advancedMetrics.riskFactors.map(f => `Risk: ${f}`) : [])
    ].slice(0, 12)
  }
  
  return {
    result: enhancedResult,
    advancedMetrics
  }
}
