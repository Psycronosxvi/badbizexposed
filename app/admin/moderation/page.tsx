"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Snowflake, 
  Play, 
  AlertTriangle, 
  Building2, 
  FileText, 
  MessageSquare,
  Loader2,
  Eye,
  Calendar,
  User
} from "lucide-react"

type ContentType = "complaints" | "businesses" | "comments"

interface ContentItem {
  id: string
  type: ContentType
  title: string
  content?: string
  author?: string
  created_at: string
  is_frozen: boolean
  frozen_at?: string
  frozen_reason?: string
  status?: string
  business_name?: string
}

export default function AdminModerationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<ContentType>("complaints")
  const [results, setResults] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [freezeReason, setFreezeReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const supabase = createClient()

  // Search content
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If no search query, load all items (including frozen)
      loadAllContent()
      return
    }

    setIsLoading(true)
    try {
      let data: ContentItem[] = []

      if (activeTab === "complaints") {
        // Use service role or direct query to bypass RLS for admin
        const { data: complaints, error } = await supabase
          .from("complaints")
          .select("id, title, content, business_name, created_at, is_frozen, frozen_at, frozen_reason, status, user_id")
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,business_name.ilike.%${searchQuery}%`)
          .order("created_at", { ascending: false })
          .limit(50)

        if (!error && complaints) {
          data = complaints.map((c) => ({
            id: c.id,
            type: "complaints" as ContentType,
            title: c.title,
            content: c.content,
            business_name: c.business_name,
            created_at: c.created_at,
            is_frozen: c.is_frozen || false,
            frozen_at: c.frozen_at,
            frozen_reason: c.frozen_reason,
            status: c.status,
          }))
        }
      } else if (activeTab === "businesses") {
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("id, name, description, city, state, created_at, is_frozen, frozen_at, frozen_reason")
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
          .order("created_at", { ascending: false })
          .limit(50)

        if (!error && businesses) {
          data = businesses.map((b) => ({
            id: b.id,
            type: "businesses" as ContentType,
            title: b.name,
            content: b.description,
            author: `${b.city}, ${b.state}`,
            created_at: b.created_at,
            is_frozen: b.is_frozen || false,
            frozen_at: b.frozen_at,
            frozen_reason: b.frozen_reason,
          }))
        }
      } else if (activeTab === "comments") {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("id, content, created_at, is_frozen, frozen_at, user_id")
          .ilike("content", `%${searchQuery}%`)
          .order("created_at", { ascending: false })
          .limit(50)

        if (!error && comments) {
          data = comments.map((c) => ({
            id: c.id,
            type: "comments" as ContentType,
            title: c.content?.substring(0, 60) + (c.content?.length > 60 ? "..." : ""),
            content: c.content,
            created_at: c.created_at,
            is_frozen: c.is_frozen || false,
            frozen_at: c.frozen_at,
          }))
        }
      }

      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load all content for the active tab
  const loadAllContent = async () => {
    setIsLoading(true)
    try {
      let data: ContentItem[] = []

      if (activeTab === "complaints") {
        const { data: complaints, error } = await supabase
          .from("complaints")
          .select("id, title, content, business_name, created_at, is_frozen, frozen_at, frozen_reason, status")
          .order("created_at", { ascending: false })
          .limit(100)

        if (!error && complaints) {
          data = complaints.map((c) => ({
            id: c.id,
            type: "complaints" as ContentType,
            title: c.title,
            content: c.content,
            business_name: c.business_name,
            created_at: c.created_at,
            is_frozen: c.is_frozen || false,
            frozen_at: c.frozen_at,
            frozen_reason: c.frozen_reason,
            status: c.status,
          }))
        }
      } else if (activeTab === "businesses") {
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("id, name, description, city, state, created_at, is_frozen, frozen_at, frozen_reason")
          .order("created_at", { ascending: false })
          .limit(100)

        if (!error && businesses) {
          data = businesses.map((b) => ({
            id: b.id,
            type: "businesses" as ContentType,
            title: b.name,
            content: b.description,
            author: `${b.city}, ${b.state}`,
            created_at: b.created_at,
            is_frozen: b.is_frozen || false,
            frozen_at: b.frozen_at,
            frozen_reason: b.frozen_reason,
          }))
        }
      } else if (activeTab === "comments") {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("id, content, created_at, is_frozen, frozen_at")
          .order("created_at", { ascending: false })
          .limit(100)

        if (!error && comments) {
          data = comments.map((c) => ({
            id: c.id,
            type: "comments" as ContentType,
            title: c.content?.substring(0, 60) + (c.content?.length > 60 ? "..." : ""),
            content: c.content,
            created_at: c.created_at,
            is_frozen: c.is_frozen || false,
            frozen_at: c.frozen_at,
          }))
        }
      }

      setResults(data)
    } catch (error) {
      console.error("Load error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Freeze/Unfreeze content
  const handleFreezeToggle = async (item: ContentItem, freeze: boolean) => {
    if (freeze) {
      setSelectedItem(item)
      setFreezeDialogOpen(true)
      return
    }

    // Unfreeze directly
    setIsProcessing(true)
    try {
      const table = item.type
      const { error } = await supabase
        .from(table)
        .update({
          is_frozen: false,
          frozen_at: null,
          frozen_by: null,
          frozen_reason: null,
        })
        .eq("id", item.id)

      if (!error) {
        setResults((prev) =>
          prev.map((r) =>
            r.id === item.id ? { ...r, is_frozen: false, frozen_at: undefined, frozen_reason: undefined } : r
          )
        )
      }
    } catch (error) {
      console.error("Unfreeze error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmFreeze = async () => {
    if (!selectedItem) return

    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const table = selectedItem.type
      const { error } = await supabase
        .from(table)
        .update({
          is_frozen: true,
          frozen_at: new Date().toISOString(),
          frozen_by: user?.id,
          frozen_reason: freezeReason || "Content frozen by admin",
        })
        .eq("id", selectedItem.id)

      if (!error) {
        setResults((prev) =>
          prev.map((r) =>
            r.id === selectedItem.id
              ? { ...r, is_frozen: true, frozen_at: new Date().toISOString(), frozen_reason: freezeReason }
              : r
          )
        )
        setFreezeDialogOpen(false)
        setFreezeReason("")
        setSelectedItem(null)
      }
    } catch (error) {
      console.error("Freeze error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Load content when tab changes
  useEffect(() => {
    loadAllContent()
  }, [activeTab])

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case "complaints":
        return <FileText className="h-4 w-4" />
      case "businesses":
        return <Building2 className="h-4 w-4" />
      case "comments":
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-muted-foreground mt-1">
          Search, review, and freeze content that violates guidelines
        </p>
      </div>

      {/* Search Bar */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, content, business name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="complaints" className="gap-2">
            <FileText className="h-4 w-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="businesses" className="gap-2">
            <Building2 className="h-4 w-4" />
            Businesses
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No content found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different search term or check another category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {results.map((item) => (
                <Card
                  key={item.id}
                  className={`bg-card border-border ${item.is_frozen ? "opacity-60 border-blue-500/50" : ""}`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                          {item.is_frozen && (
                            <Badge variant="secondary" className="gap-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                              <Snowflake className="h-3 w-3" />
                              Frozen
                            </Badge>
                          )}
                          {item.status && (
                            <Badge variant="outline" className="capitalize">
                              {item.status}
                            </Badge>
                          )}
                        </div>

                        {item.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {item.content}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {item.business_name && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {item.business_name}
                            </span>
                          )}
                          {item.author && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.author}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {item.is_frozen && item.frozen_reason && (
                          <div className="mt-2 p-2 rounded bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-400">
                              <span className="font-medium">Freeze reason:</span> {item.frozen_reason}
                            </p>
                            {item.frozen_at && (
                              <p className="text-xs text-blue-400/70 mt-1">
                                Frozen on {new Date(item.frozen_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (item.type === "complaints") {
                              window.open(`/complaints/${item.id}`, "_blank")
                            } else if (item.type === "businesses") {
                              window.open(`/business/${item.id}`, "_blank")
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {item.is_frozen ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-green-500/30 text-green-500 hover:bg-green-500/10"
                            onClick={() => handleFreezeToggle(item, false)}
                            disabled={isProcessing}
                          >
                            <Play className="h-4 w-4" />
                            Unfreeze
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                            onClick={() => handleFreezeToggle(item, true)}
                            disabled={isProcessing}
                          >
                            <Snowflake className="h-4 w-4" />
                            Freeze
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Freeze Dialog */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-blue-500" />
              Freeze Content
            </DialogTitle>
            <DialogDescription>
              This will hide the content from public view. Users will not be able to see this content until it is unfrozen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Content to freeze:</p>
              <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                {selectedItem?.title}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Reason for freezing (optional)
              </label>
              <Textarea
                placeholder="Enter the reason for freezing this content..."
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmFreeze}
              disabled={isProcessing}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Snowflake className="h-4 w-4" />
              )}
              Freeze Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
