"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye,
  AlertTriangle,
  MapPin
} from "lucide-react"

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
  pending: "bg-muted text-muted-foreground",
  approved: "bg-success/20 text-success",
  rejected: "bg-destructive/20 text-destructive",
}

interface ComplaintCardProps {
  complaint: {
    id: string
    title: string
    content?: string
    user: {
      display_name: string
      avatar_url: string
    }
    company_name: string
    company_slug?: string
    category?: string
    city?: string
    state?: string
    severity: number
    status: string
    upvotes: number
    downvotes: number
    comment_count: number
    view_count: number
    created_at: string
    is_featured?: boolean
  }
  showContent?: boolean
}

export function ComplaintCard({ complaint, showContent = false }: ComplaintCardProps) {
  return (
    <Link href={`/complaints/${complaint.id}`} className="block group">
      <Card className="bg-card border-border hover:border-primary/50 transition-all">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Vote buttons */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button 
                className="p-1.5 rounded hover:bg-success/20 text-muted-foreground hover:text-success transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className="text-sm font-bold text-foreground">
                {complaint.upvotes - complaint.downvotes}
              </span>
              <button 
                className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-lg">
                  {complaint.title}
                </h3>
                {complaint.severity >= 4 && (
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                )}
                {complaint.is_featured && (
                  <Badge className="bg-primary/20 text-primary border-0 shrink-0">
                    Featured
                  </Badge>
                )}
              </div>

              {showContent && complaint.content && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {complaint.content}
                </p>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Image
                  src={complaint.user.avatar_url}
                  alt={complaint.user.display_name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  {complaint.user.display_name}
                </span>
                <span className="text-muted-foreground">•</span>
                <Link 
                  href={`/business/${complaint.company_slug || complaint.company_name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-accent hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {complaint.company_name}
                </Link>
                {complaint.city && complaint.state && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {complaint.city}, {complaint.state}
                    </span>
                  </>
                )}
              </div>

              {/* Badges and stats */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {complaint.category && (
                  <Badge variant="outline" className="text-xs">
                    {complaint.category}
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${severityColors[complaint.severity as keyof typeof severityColors]}`}
                >
                  Severity {complaint.severity}
                </Badge>
                <Badge 
                  variant="secondary"
                  className={`text-xs ${statusColors[complaint.status as keyof typeof statusColors] || statusColors.pending}`}
                >
                  {complaint.status}
                </Badge>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {complaint.comment_count}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {complaint.view_count.toLocaleString()}
                </span>
                <span>
                  {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
