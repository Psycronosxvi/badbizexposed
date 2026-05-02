"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MessageSquare, 
  Search, 
  MoreHorizontal, 
  Eye,
  Pin,
  PinOff,
  Archive,
  Trash2,
  Flag,
  CheckCircle,
  XCircle,
  MessageCircle,
  ThumbsUp
} from "lucide-react"

type Discussion = {
  id: string
  title: string
  content: string
  user_id: string
  category: string | null
  is_pinned: boolean
  is_locked: boolean
  status: string
  created_at: string
  reply_count?: number
  vote_count?: number
  profiles?: {
    username: string | null
    display_name: string | null
  }
}

export default function AdminDiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    fetchDiscussions()
  }, [statusFilter])

  async function fetchDiscussions() {
    setLoading(true)
    let query = supabase
      .from("discussions")
      .select(`
        *,
        profiles:user_id (username, display_name)
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    const { data, error } = await query

    if (!error && data) {
      setDiscussions(data)
    }
    setLoading(false)
  }

  async function updateDiscussion(id: string, updates: Partial<Discussion>) {
    const { error } = await supabase
      .from("discussions")
      .update(updates)
      .eq("id", id)

    if (!error) {
      await logAdminAction("update_discussion", id, updates)
      fetchDiscussions()
    }
  }

  async function deleteDiscussion(id: string) {
    if (!confirm("Are you sure you want to delete this discussion? This cannot be undone.")) return

    const { error } = await supabase
      .from("discussions")
      .delete()
      .eq("id", id)

    if (!error) {
      await logAdminAction("delete_discussion", id, {})
      fetchDiscussions()
    }
  }

  async function logAdminAction(action: string, targetId: string, details: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action,
        target_type: "discussion",
        target_id: targetId,
        details,
      })
    }
  }

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: discussions.length,
    pinned: discussions.filter(d => d.is_pinned).length,
    locked: discussions.filter(d => d.is_locked).length,
    flagged: discussions.filter(d => d.status === "flagged").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discussion Management</h1>
          <p className="text-muted-foreground">Moderate community discussions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Discussions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pinned</p>
                <p className="text-2xl font-bold">{stats.pinned}</p>
              </div>
              <Pin className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Locked</p>
                <p className="text-2xl font-bold">{stats.locked}</p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold">{stats.flagged}</p>
              </div>
              <Flag className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discussions Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussions ({filteredDiscussions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Discussion</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading discussions...
                  </TableCell>
                </TableRow>
              ) : filteredDiscussions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No discussions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDiscussions.map((discussion) => (
                  <TableRow key={discussion.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <div className="flex items-center gap-2">
                          {discussion.is_pinned && (
                            <Pin className="h-3 w-3 text-accent flex-shrink-0" />
                          )}
                          <p className="font-medium truncate">{discussion.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {discussion.content.substring(0, 100)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {discussion.profiles?.display_name || discussion.profiles?.username || "Anonymous"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{discussion.category || "General"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {discussion.is_locked && (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                            Locked
                          </Badge>
                        )}
                        {discussion.status === "flagged" && (
                          <Badge variant="outline" className="text-red-500 border-red-500/30">
                            Flagged
                          </Badge>
                        )}
                        {!discussion.is_locked && discussion.status !== "flagged" && (
                          <Badge variant="outline" className="text-green-500 border-green-500/30">
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(discussion.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`/discuss/${discussion.id}`, "_blank")}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Discussion
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateDiscussion(discussion.id, { is_pinned: !discussion.is_pinned })}>
                            {discussion.is_pinned ? (
                              <>
                                <PinOff className="h-4 w-4 mr-2" />
                                Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="h-4 w-4 mr-2" />
                                Pin to Top
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateDiscussion(discussion.id, { is_locked: !discussion.is_locked })}>
                            {discussion.is_locked ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Unlock
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Lock Thread
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateDiscussion(discussion.id, { status: "flagged" })}>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag for Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateDiscussion(discussion.id, { status: "archived" })}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteDiscussion(discussion.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
