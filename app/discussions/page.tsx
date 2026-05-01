import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { MessageSquare, Users, TrendingUp, Clock, Plus, Pin } from "lucide-react"

export const metadata: Metadata = {
  title: "Discussions | BadBiz Exposed",
  description: "Join the conversation with fellow consumers. Share tips, ask questions, and connect with others.",
}

const categories = [
  {
    name: "General Discussion",
    description: "Open discussion about consumer issues and experiences",
    icon: MessageSquare,
    topics: 156,
    posts: 1243
  },
  {
    name: "Housing & Landlords",
    description: "Discuss tenant rights, landlord issues, and housing problems",
    icon: Users,
    topics: 89,
    posts: 723
  },
  {
    name: "Scam Alerts",
    description: "Warn others about scams and fraudulent businesses",
    icon: TrendingUp,
    topics: 67,
    posts: 445
  },
  {
    name: "Success Stories",
    description: "Share your wins and resolved complaints",
    icon: TrendingUp,
    topics: 34,
    posts: 189
  }
]

const pinnedTopics = [
  {
    title: "Welcome to BadBiz Exposed Discussions!",
    author: "Admin",
    replies: 45,
    lastActivity: "2 hours ago",
    pinned: true
  },
  {
    title: "Community Guidelines - Please Read Before Posting",
    author: "Admin", 
    replies: 12,
    lastActivity: "1 day ago",
    pinned: true
  }
]

const recentTopics = [
  {
    title: "Has anyone dealt with XYZ Property Management?",
    author: "TenantAdvocate",
    avatar: "TA",
    category: "Housing & Landlords",
    replies: 23,
    lastActivity: "15 minutes ago"
  },
  {
    title: "Tips for documenting contractor work issues",
    author: "HomeOwner2024",
    avatar: "HO",
    category: "General Discussion",
    replies: 18,
    lastActivity: "1 hour ago"
  },
  {
    title: "Warning: Phone scam claiming to be from utility company",
    author: "ConsumerWatch",
    avatar: "CW",
    category: "Scam Alerts",
    replies: 56,
    lastActivity: "2 hours ago"
  },
  {
    title: "Finally got my security deposit back after 6 months!",
    author: "VictoryLap",
    avatar: "VL",
    category: "Success Stories",
    replies: 31,
    lastActivity: "3 hours ago"
  },
  {
    title: "Best practices for filing complaints with state AG",
    author: "LegalEagle",
    avatar: "LE",
    category: "General Discussion",
    replies: 42,
    lastActivity: "5 hours ago"
  }
]

export default function DiscussionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Discussions
              </h1>
              <p className="text-muted-foreground">
                Connect with fellow consumers, share experiences, and get advice.
              </p>
            </div>
            <Button asChild>
              <Link href="/auth/login">
                <Plus className="h-4 w-4 mr-2" />
                Start a Discussion
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pinned Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pin className="h-5 w-5 text-primary" />
                    Pinned Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pinnedTopics.map((topic) => (
                    <div 
                      key={topic.title}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div>
                        <h3 className="font-medium">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {topic.author} · {topic.replies} replies
                        </p>
                      </div>
                      <Badge variant="secondary">{topic.lastActivity}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTopics.map((topic) => (
                    <div 
                      key={topic.title}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback>{topic.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1 truncate">{topic.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>By {topic.author}</span>
                          <span>·</span>
                          <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                          <span>·</span>
                          <span>{topic.replies} replies</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {topic.lastActivity}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map((category) => (
                    <div 
                      key={category.name}
                      className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <category.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{category.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{category.topics} topics</span>
                        <span>{category.posts} posts</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">2,547</div>
                      <div className="text-sm text-muted-foreground">Members</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">346</div>
                      <div className="text-sm text-muted-foreground">Topics</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">4,821</div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">127</div>
                      <div className="text-sm text-muted-foreground">Online</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
