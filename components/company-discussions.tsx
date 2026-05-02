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
  Pin,
  Lock,
  User,
  Clock
} from "lucide-react"
import type { Discussion } from "@/lib/types"

interface CompanyDiscussionsProps {
  discussions: Discussion[]
}

export function CompanyDiscussions({ discussions }: CompanyDiscussionsProps) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <Card 
          key={discussion.id} 
          className={`bg-card border-border hover:border-accent/30 transition-all ${discussion.is_pinned ? 'border-accent/50' : ''}`}
        >
          <CardContent className="p-5">
            <div className="flex gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-success/20 hover:text-success">
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <span className="text-lg font-bold text-foreground">
                  {discussion.upvotes - discussion.downvotes}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Link href={`/discussions/${discussion.id}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {discussion.is_pinned && (
                      <Pin className="h-4 w-4 text-accent shrink-0 mt-1" />
                    )}
                    <h3 className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                      {discussion.title}
                    </h3>
                    {discussion.is_locked && (
                      <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    )}
                  </div>
                </Link>

                <p className="text-muted-foreground line-clamp-2 mb-3">
                  {discussion.content}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {discussion.is_pinned && (
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      Pinned
                    </Badge>
                  )}

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {discussion.comment_count} comments
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {discussion.view_count} views
                  </span>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-4 w-4" />
                    {discussion.user?.display_name || 'User'}
                  </span>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {discussions.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No discussions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a discussion to connect with others about this company.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
