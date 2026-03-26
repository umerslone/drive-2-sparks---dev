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

export async function searchWeb(query, limit = 5) {
  const cleanQuery = cleanText(query)
  const boundedLimit = Math.max(1, Math.min(Number(limit) || 5, 8))

  if (!cleanQuery) {
    return {
      provider: "none",
      results: [],
    }
  }

  const serpApiKey = process.env.SERPAPI_API_KEY
  if (serpApiKey) {
    try {
      const result = await searchWithSerpApi(cleanQuery, boundedLimit, serpApiKey)
      if (result.results.length > 0) return result
    } catch (err) {
      console.warn("[web-search] serpapi failed:", err instanceof Error ? err.message : String(err))
    }
  }

  try {
    return await searchWithDuckDuckGo(cleanQuery, boundedLimit)
  } catch (err) {
    console.warn("[web-search] duckduckgo failed:", err instanceof Error ? err.message : String(err))
    return {
      provider: "none",
      results: [],
    }
  }
}
