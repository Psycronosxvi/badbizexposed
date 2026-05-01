"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  Users, 
  Building2, 
  TrendingUp, 
  MessageSquare,
  CheckCircle 
} from "lucide-react"

interface StatsCardsProps {
  stats: {
    total_complaints: number
    total_users: number
    total_companies: number
    complaints_this_week: number
    active_discussions: number
    resolved_complaints: number
  }
}

export function StatsCards({ stats: initialStats }: StatsCardsProps) {
  const [stats, setStats] = useState(initialStats)

  // Animate numbers increasing slightly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        total_complaints: prev.total_complaints + (Math.random() > 0.7 ? 1 : 0),
        total_users: prev.total_users + (Math.random() > 0.8 ? 1 : 0),
        active_discussions: prev.active_discussions + (Math.random() > 0.9 ? 1 : 0),
      }))
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      label: "Total Complaints",
      value: stats.total_complaints.toLocaleString(),
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Users",
      value: stats.total_users.toLocaleString(),
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Companies Listed",
      value: stats.total_companies.toLocaleString(),
      icon: Building2,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "This Week",
      value: `+${stats.complaints_this_week}`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Discussions",
      value: stats.active_discussions.toLocaleString(),
      icon: MessageSquare,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      label: "Resolved",
      value: stats.resolved_complaints.toLocaleString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
