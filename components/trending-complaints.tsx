"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye,
  AlertTriangle,
  TrendingUp,
  Flame,
  Loader2
} from "lucide-react"

type Complaint = {
  id: string
  title: string
  content: string
  business_name: string
  business_slug: string
  category: string
  city: string
  state: string
  severity: number
  status: string
  upvotes: number
  downvotes: number
  comment_count: number
  view_count: number
  created_at: string
  is_featured: boolean
}

const severityColors: Record<number, string> = {
  1: "bg-muted text-muted-foreground",
  2: "bg-chart-4/20 text-chart-4",
  3: "bg-warning/20 text-warning",
  4: "bg-destructive/20 text-destructive",
  5: "bg-destructive text-destructive-foreground",
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning",
  approved: "bg-primary/20 text-primary",
  resolved: "bg-success/20 text-success",
  rejected: "bg-muted text-muted-foreground",
}

export function TrendingComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchComplaints() {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("status", "approved")
        .order("upvotes", { ascending: false })
        .limit(5)

      if (data && !error) {
        setComplaints(data)
      }
      setLoading(false)
    }

    fetchComplaints()
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Trending Complaints
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          Trending Complaints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {complaints.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No complaints yet</p>
        ) : (
          complaints.map((complaint, index) => (
            <Link
              key={complaint.id}
              href={`/complaints/${complaint.id}`}
              className="block group"
            >
              <div className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all">
                {/* Rank */}
                <div className="flex flex-col items-center justify-center w-8 shrink-0">
                  <span className={`text-lg font-bold ${index < 3 ? "text-primary" : "text-muted-foreground"}`}>
                    #{index + 1}
                  </span>
                  {index < 3 && <TrendingUp className="h-3 w-3 text-primary" />}
                </div>

                {/* Vote count */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button className="p-1 rounded hover:bg-success/20 text-muted-foreground hover:text-success transition-colors">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-foreground">
                    {complaint.upvotes - complaint.downvotes}
                  </span>
                  <button className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {complaint.title}
                    </h3>
                    {complaint.severity >= 4 && (
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    {complaint.is_featured && (
                      <Badge className="bg-accent/20 text-accent border-accent/30 text-xs shrink-0">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Business info */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-accent">
                      {complaint.business_name}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {complaint.city}, {complaint.state}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${severityColors[complaint.severity] || severityColors[3]}`}
                    >
                      Severity {complaint.severity}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                    >
                      {complaint.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {complaint.comment_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {complaint.view_count.toLocaleString()}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}

        <Link
          href="/complaints"
          className="block text-center text-sm text-primary hover:underline pt-2"
        >
          View all complaints
        </Link>
      </CardContent>
    </Card>
  )
}
