"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { 
  FileText, 
  MessageSquare, 
  ThumbsUp, 
  UserPlus, 
  Upload,
  MessageCircle,
  Circle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockUsers, mockActivityFeed } from "@/lib/mock-data"

interface ActivityItem {
  id: string
  type: string
  message: string
  user: {
    id: string
    username: string
    display_name: string
    avatar_url: string
  }
  company_name?: string
  created_at: string
}

const activityIcons = {
  complaint: FileText,
  discussion: MessageCircle,
  comment: MessageSquare,
  vote: ThumbsUp,
  user_joined: UserPlus,
  evidence_uploaded: Upload,
}

const activityColors = {
  complaint: "text-primary",
  discussion: "text-accent",
  comment: "text-muted-foreground",
  vote: "text-success",
  user_joined: "text-chart-4",
  evidence_uploaded: "text-chart-5",
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(() => 
    mockActivityFeed.map(a => ({
      id: a.id,
      type: a.type,
      message: a.message,
      user: a.user,
      company_name: a.company_name,
      created_at: a.created_at,
    }))
  )
  const [isLive, setIsLive] = useState(true)

  // Simulate live updates with realistic activity
  useEffect(() => {
    if (!isLive) return

    const activityTypes = [
      { type: "complaint", messages: [
        "filed a complaint against",
        "reported issues with",
        "submitted evidence against"
      ]},
      { type: "comment", messages: [
        "commented on a complaint about",
        "replied to a discussion about",
        "shared their experience with"
      ]},
      { type: "vote", messages: [
        "upvoted a complaint against",
        "supported a report about",
        "endorsed a complaint against"
      ]},
      { type: "user_joined", messages: [
        "joined BadBizExposed",
        "became a consumer advocate",
        "joined the community"
      ]},
    ]

    const companyNames = [
      "Greystar Property Management",
      "Lincoln Property Company", 
      "Riverside Heights HOA",
      "Two Men and a Truck",
      "ABC Renovations",
      "Century 21 Realty",
      "Sunset Valley HOA",
      "Pinnacle Property Group"
    ]

    const interval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
      const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const randomMessage = randomActivityType.messages[Math.floor(Math.random() * randomActivityType.messages.length)]
      const randomCompany = companyNames[Math.floor(Math.random() * companyNames.length)]

      const newActivity: ActivityItem = {
        id: crypto.randomUUID(),
        type: randomActivityType.type,
        message: randomMessage,
        user: randomUser,
        company_name: randomActivityType.type !== "user_joined" ? randomCompany : undefined,
        created_at: new Date().toISOString(),
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 14)])
    }, 6000 + Math.random() * 8000) // Random interval between 6-14 seconds

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Live Activity
            <span className="flex items-center gap-1 text-xs font-normal text-success">
              <Circle className="h-2 w-2 fill-success animate-pulse" />
              Live
            </span>
          </CardTitle>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type as keyof typeof activityIcons] || FileText
          const colorClass = activityColors[activity.type as keyof typeof activityColors] || "text-muted-foreground"
          
          return (
            <div
              key={activity.id || index}
              className={`flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors ${
                index === 0 ? "animate-in fade-in slide-in-from-top-2 duration-300" : ""
              }`}
            >
              {/* User Avatar */}
              <div className="relative shrink-0">
                <Image
                  src={activity.user.avatar_url}
                  alt={activity.user.display_name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full bg-background ${colorClass}`}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user.display_name}</span>
                  {" "}
                  <span className="text-muted-foreground">{activity.message}</span>
                  {activity.company_name && (
                    <>
                      {" "}
                      <span className="font-medium text-accent">{activity.company_name}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
