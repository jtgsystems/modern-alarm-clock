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
    [key: string]: any
  }>
  [key: string]: any
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

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key is not configured" }, 
      { status: 500 }
    )
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
      const errorData = await response.json()
      throw new Error(`News API responded with status ${response.status}: ${JSON.stringify(errorData)}`)
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
    return NextResponse.json(
      { 
        error: "Failed to fetch news", 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
}
