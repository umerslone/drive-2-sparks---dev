function cleanText(value) {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim()
}

async function searchWithSerpApi(query, limit, apiKey) {
  const endpoint = new URL("https://serpapi.com/search.json")
  endpoint.searchParams.set("engine", "google")
  endpoint.searchParams.set("q", query)
  endpoint.searchParams.set("num", String(Math.max(1, Math.min(limit, 10))))
  endpoint.searchParams.set("api_key", apiKey)

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers: { "Accept": "application/json" },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`SerpApi error ${response.status}: ${body.slice(0, 160)}`)
  }

  const data = await response.json()
  const organic = Array.isArray(data?.organic_results) ? data.organic_results : []

  const results = organic
    .slice(0, limit)
    .map((item) => ({
      title: cleanText(item?.title),
      url: cleanText(item?.link),
      snippet: cleanText(item?.snippet || item?.snippet_highlighted_words?.join(" ") || ""),
      source: "google",
    }))
    .filter((item) => item.title && item.url)

  return {
    provider: "serpapi",
    results,
  }
}

async function searchWithDuckDuckGo(query, limit) {
  const endpoint = new URL("https://api.duckduckgo.com/")
  endpoint.searchParams.set("q", query)
  endpoint.searchParams.set("format", "json")
  endpoint.searchParams.set("no_html", "1")
  endpoint.searchParams.set("skip_disambig", "1")

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers: { "Accept": "application/json" },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`DuckDuckGo error ${response.status}: ${body.slice(0, 160)}`)
  }

  const data = await response.json()
  const results = []

  const abstractText = cleanText(data?.AbstractText)
  const abstractUrl = cleanText(data?.AbstractURL)
  const heading = cleanText(data?.Heading)
  if (abstractText && abstractUrl) {
    results.push({
      title: heading || "DuckDuckGo Result",
      url: abstractUrl,
      snippet: abstractText,
      source: "duckduckgo",
    })
  }

  const relatedTopics = Array.isArray(data?.RelatedTopics) ? data.RelatedTopics : []
  for (const item of relatedTopics) {
    if (results.length >= limit) break

    if (Array.isArray(item?.Topics)) {
      for (const nested of item.Topics) {
        if (results.length >= limit) break
        const text = cleanText(nested?.Text)
        const url = cleanText(nested?.FirstURL)
        if (!text || !url) continue
        results.push({
          title: text.split(" - ")[0] || "DuckDuckGo Topic",
          url,
          snippet: text,
          source: "duckduckgo",
        })
      }
      continue
    }

    const text = cleanText(item?.Text)
    const url = cleanText(item?.FirstURL)
    if (!text || !url) continue
    results.push({
      title: text.split(" - ")[0] || "DuckDuckGo Topic",
      url,
      snippet: text,
      source: "duckduckgo",
    })
  }

  return {
    provider: "duckduckgo",
    results: results.slice(0, limit),
  }
}

function normalizeSearchCansResults(payload, limit) {
  const candidates = []
  const topLevelArrays = [
    payload?.results,
    payload?.items,
    payload?.organic_results,
    payload?.data,
  ]

  for (const arr of topLevelArrays) {
    if (!Array.isArray(arr)) continue
    for (const item of arr) {
      const title = cleanText(item?.title || item?.name || item?.heading)
      const url = cleanText(item?.url || item?.link || item?.href)
      const snippet = cleanText(item?.snippet || item?.description || item?.text || "")
      if (!title || !url) continue
      candidates.push({ title, url, snippet, source: "searchcans" })
      if (candidates.length >= limit) return candidates
    }
  }

  return candidates
}

async function searchWithSearchCans(query, limit, apiKey) {
  const endpoint = process.env.SEARCHCANS_API_URL || "https://www.searchcans.com/api/search"

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      s: query,
      t: "google",
      p: 1,
      num: Math.max(1, Math.min(limit, 10)),
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`SearchCans error ${response.status}: ${body.slice(0, 160)}`)
  }

  const data = await response.json()
  const results = normalizeSearchCansResults(data, limit)

  return {
    provider: "searchcans",
    results,
  }
}

export async function searchWeb(query, limit = 5, options = {}) {
  const cleanQuery = cleanText(query)
  const boundedLimit = Math.max(1, Math.min(Number(limit) || 5, 8))
  const preferredProviders = Array.isArray(options?.providers)
    ? options.providers
    : ["searchcans", "serpapi", "duckduckgo"]

  if (!cleanQuery) {
    return {
      provider: "none",
      results: [],
    }
  }

  for (const provider of preferredProviders) {
    if (provider === "searchcans") {
      const searchCansApiKey = process.env.SEARCHCANS_API_KEY
      if (!searchCansApiKey) continue
      try {
        const result = await searchWithSearchCans(cleanQuery, boundedLimit, searchCansApiKey)
        if (result.results.length > 0) return result
      } catch (err) {
        console.warn("[web-search] searchcans failed:", err instanceof Error ? err.message : String(err))
      }
      continue
    }

    if (provider === "serpapi") {
      const serpApiKey = process.env.SERPAPI_API_KEY
      if (!serpApiKey) continue
      try {
        const result = await searchWithSerpApi(cleanQuery, boundedLimit, serpApiKey)
        if (result.results.length > 0) return result
      } catch (err) {
        console.warn("[web-search] serpapi failed:", err instanceof Error ? err.message : String(err))
      }
      continue
    }

    if (provider === "duckduckgo") {
      try {
        const result = await searchWithDuckDuckGo(cleanQuery, boundedLimit)
        if (result.results.length > 0) return result
      } catch (err) {
        console.warn("[web-search] duckduckgo failed:", err instanceof Error ? err.message : String(err))
      }
    }
  }

  return {
    provider: "none",
    results: [],
  }
}
