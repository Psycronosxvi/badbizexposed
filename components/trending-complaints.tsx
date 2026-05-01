"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye,
  AlertTriangle,
  TrendingUp,
  Flame
} from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"

const severityColors = {
  1: "bg-muted text-muted-foreground",
  2: "bg-chart-4/20 text-chart-4",
  3: "bg-warning/20 text-warning",
  4: "bg-destructive/20 text-destructive",
  5: "bg-destructive text-destructive-foreground",
}

const statusColors = {
  open: "bg-primary/20 text-primary",
  investigating: "bg-warning/20 text-warning",
  resolved: "bg-success/20 text-success",
  closed: "bg-muted text-muted-foreground",
}

export function TrendingComplaints() {
  const complaints = mockComplaints.slice(0, 5)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          Trending Complaints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {complaints.map((complaint, index) => (
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

              {/* Vote buttons */}
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
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={complaint.user.avatar_url}
                    alt={complaint.user.display_name}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <span className="text-xs text-muted-foreground">
                    {complaint.user.display_name}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-medium text-accent">
                    {complaint.company_name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${severityColors[complaint.severity as keyof typeof severityColors]}`}
                  >
                    Severity {complaint.severity}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={`text-xs ${statusColors[complaint.status as keyof typeof statusColors]}`}
                  >
                    {complaint.status}
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
        ))}

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
