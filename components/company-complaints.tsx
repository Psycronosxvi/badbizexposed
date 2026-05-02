"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Eye,
  AlertTriangle,
  CheckCircle,
  User,
  Clock
} from "lucide-react"
import type { Complaint } from "@/lib/types"

interface CompanyComplaintsProps {
  complaints: Complaint[]
}

const severityLabels = ['Minor', 'Low', 'Medium', 'High', 'Critical']
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

export function CompanyComplaints({ complaints }: CompanyComplaintsProps) {
  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="bg-card border-border hover:border-primary/30 transition-all">
          <CardContent className="p-5">
            <div className="flex gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-success/20 hover:text-success">
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <span className="text-lg font-bold text-foreground">
                  {complaint.upvotes - complaint.downvotes}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Link href={`/complaints/${complaint.id}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {complaint.title}
                    </h3>
                    {complaint.is_verified && (
                      <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                    )}
                    {complaint.severity >= 4 && (
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                    )}
                  </div>
                </Link>

                <p className="text-muted-foreground line-clamp-2 mb-3">
                  {complaint.content}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge 
                    variant="secondary" 
                    className={severityColors[complaint.severity as keyof typeof severityColors]}
                  >
                    {severityLabels[complaint.severity - 1]}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={statusColors[complaint.status]}
                  >
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </Badge>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {complaint.comment_count}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {complaint.view_count}
                  </span>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-4 w-4" />
                    {complaint.is_anonymous ? 'Anonymous' : complaint.user?.display_name || 'User'}
                  </span>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {complaints.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No complaints yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to report an issue with this company.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
