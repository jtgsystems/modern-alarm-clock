"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Newspaper } from "lucide-react"

interface NewsItem {
  title: string
  url: string
}

interface NewsScrollerProps {
  location: string
}

const NewsScroller: React.FC<NewsScrollerProps> = ({ location }) => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // In a real application, you would replace this with an actual API call
        // For demonstration purposes, we're using mock data
        const mockNews: NewsItem[] = [
          { title: `Local event in ${location} draws large crowd`, url: "#" },
          { title: `${location} city council approves new development project`, url: "#" },
          { title: `Weather update: Unexpected sunshine in ${location} this weekend`, url: "#" },
          { title: `${location} school district announces new educational program`, url: "#" },
          { title: `Local business in ${location} celebrates 50 years`, url: "#" },
        ]
        setNews(mockNews)
      } catch (error) {
        console.error("Failed to fetch news:", error)
      }
    }

    fetchNews()
  }, [location])

  if (news.length === 0) {
    return null
  }

  return (
    <div className="relative overflow-hidden backdrop-blur-xl">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/30 to-purple-600/30 rounded-[2.1rem] opacity-40 blur-sm" />
      
      {/* Main container */}
      <div className="relative rounded-[2rem] overflow-hidden">
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-900/80 backdrop-blur-sm" />
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-white/70" />
            <h3 className="text-white/90 font-medium">Local News</h3>
          </div>

          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {news.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className={cn(
                    "block p-3 rounded-lg",
                    "bg-white/5 hover:bg-white/10",
                    "border border-white/10 hover:border-white/20",
                    "transition-all duration-200"
                  )}
                >
                  <p className="text-sm text-white/80 leading-relaxed">{item.title}</p>
                </a>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Subtle inner border */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none" />
      </div>
    </div>
  )
}

export default NewsScroller

