import { DocumentFingerprintRecord, ExternalSourceMatch } from "@/types"

export function normalizeDocumentText(text: string): string {
  return text
    .replaceAll("\u0000", "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export async function createDocumentFingerprint(text: string): Promise<string> {
  const normalized = normalizeDocumentText(text).toLowerCase().replace(/\s+/g, " ")
  const buffer = new TextEncoder().encode(normalized)
  const digest = await crypto.subtle.digest("SHA-256", buffer)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export function buildDocumentPreview(text: string, maxLength = 160): string {
  const normalized = normalizeDocumentText(text).replace(/\s+/g, " ")
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized
}

export function findFingerprintMatches(
  fingerprint: string,
  registry: DocumentFingerprintRecord[]
): ExternalSourceMatch[] {
  return registry
    .filter((entry) => entry.fingerprint === fingerprint)
    .sort((left, right) => right.lastReviewedAt - left.lastReviewedAt)
    .map((entry) => ({
      source: entry.fileName,
      similarity: 100,
      matchType: "exact",
      repository: "internal fingerprint registry",
      provider: "fingerprint-registry",
      lastSeenAt: entry.lastReviewedAt,
      retentionState: "active",
    }))
}

export function calculateTokenOverlapSimilarity(leftText: string, rightText: string): number {
  const leftTokens = new Set(tokenize(leftText))
  const rightTokens = new Set(tokenize(rightText))

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0
  }

  let overlap = 0
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      overlap += 1
    }
  })

  const denominator = Math.max(leftTokens.size, rightTokens.size)
  return Math.round((overlap / denominator) * 100)
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4)
}