import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.NEWS_API_KEY

if (!API_KEY) {
  console.error("NEWS_API_KEY is not set in the environment variables")
}

interface NewsArticle {
  title: string
  url: string
}

interface NewsAPIResponse {
  articles: Array<{
    title: string
    url: string
  }>
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json(
      { error: "Location is required" },
      { status: 400 }
    )
  }

  // Degrade gracefully when no API key is set (avoid server 500s during dev/demo)
  if (!API_KEY) {
    return NextResponse.json([], { status: 200, headers: { 'x-news-warning': 'missing-api-key' } })
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(location)}&apiKey=${API_KEY}&pageSize=5`,
      {
        next: {
          revalidate: 1800 // Revalidate every 30 minutes
        }
      }
    )

    if (!response.ok) {
      let errorBody: unknown = null
      try { errorBody = await response.json() } catch {}
      console.error('News API error', response.status, errorBody)
      return NextResponse.json([], { status: 200, headers: { 'x-news-warning': `newsapi-${response.status}` } })
    }

    const data: NewsAPIResponse = await response.json()

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Unexpected response format from News API")
    }

    const news: NewsArticle[] = data.articles.map(article => ({
      title: article.title,
      url: article.url,
    }))

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return empty list rather than 500 to prevent page errors in demo/dev
    return NextResponse.json([], { status: 200, headers: { 'x-news-warning': 'fetch-failed' } })
  }
}
