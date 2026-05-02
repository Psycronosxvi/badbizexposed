"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, Key, Rss, Globe, Save, Plus, Trash2, 
  RefreshCw, Check, AlertCircle, Newspaper, MessageCircle
} from "lucide-react"

// Placeholder feed functions
async function getNewsFeeds() {
  return [
    { id: "1", name: "News API - Consumer News", type: "news", url: "https://newsapi.org/v2/everything", is_enabled: false },
  ]
}

async function getRedditFeeds() {
  return [
    { id: "2", name: "Reddit - Scams", type: "reddit", url: "https://www.reddit.com/r/scams", is_enabled: false },
    { id: "3", name: "Reddit - Consumer Rights", type: "reddit", url: "https://www.reddit.com/r/consumerrights", is_enabled: false },
  ]
}

async function getRSSFeeds() {
  return [
    { id: "4", name: "BBB RSS Feed", type: "rss", url: "https://www.bbb.org/rss", is_enabled: false },
  ]
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    news_api_key: "",
    reddit_client_id: "",
    reddit_client_secret: "",
    auto_approve_complaints: false,
    require_email_verification: true,
    points_per_complaint: "10",
    points_per_comment: "2",
    points_per_upvote: "1",
  })

  const [feeds, setFeeds] = useState<{
    news: Array<{ id: string; name: string; type: string; url: string; is_enabled: boolean }>
    reddit: Array<{ id: string; name: string; type: string; url: string; is_enabled: boolean }>
    rss: Array<{ id: string; name: string; type: string; url: string; is_enabled: boolean }>
  }>({
    news: [],
    reddit: [],
    rss: [],
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load feeds
    async function loadFeeds() {
      const [newsFeeds, redditFeeds, rssFeeds] = await Promise.all([
        getNewsFeeds(),
        getRedditFeeds(),
        getRSSFeeds(),
      ])
      setFeeds({
        news: newsFeeds,
        reddit: redditFeeds,
        rss: rssFeeds,
      })
    }
    loadFeeds()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleFeed = (type: "news" | "reddit" | "rss", feedId: string) => {
    setFeeds(prev => ({
      ...prev,
      [type]: prev[type].map(f => 
        f.id === feedId ? { ...f, is_enabled: !f.is_enabled } : f
      )
    }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Admin Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure API keys, feeds, and platform settings
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>

          <Tabs defaultValue="api-keys" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api-keys" className="gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="feeds" className="gap-2">
                <Rss className="h-4 w-4" />
                Data Feeds
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <Globe className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="points" className="gap-2">
                <Settings className="h-4 w-4" />
                Points
              </TabsTrigger>
            </TabsList>

            {/* API Keys Tab */}
            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    News API
                  </CardTitle>
                  <CardDescription>
                    Connect to News API for consumer news aggregation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="news_api_key">API Key</Label>
                    <Input
                      id="news_api_key"
                      type="password"
                      placeholder="Enter your News API key"
                      value={settings.news_api_key}
                      onChange={(e) => setSettings(s => ({ ...s, news_api_key: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your API key from <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">newsapi.org</a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Reddit API
                  </CardTitle>
                  <CardDescription>
                    Connect to Reddit for community discussions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reddit_client_id">Client ID</Label>
                    <Input
                      id="reddit_client_id"
                      placeholder="Enter Reddit Client ID"
                      value={settings.reddit_client_id}
                      onChange={(e) => setSettings(s => ({ ...s, reddit_client_id: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reddit_client_secret">Client Secret</Label>
                    <Input
                      id="reddit_client_secret"
                      type="password"
                      placeholder="Enter Reddit Client Secret"
                      value={settings.reddit_client_secret}
                      onChange={(e) => setSettings(s => ({ ...s, reddit_client_secret: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create an app at <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">reddit.com/prefs/apps</a>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Feeds Tab */}
            <TabsContent value="feeds" className="space-y-6">
              {/* News Feeds */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5" />
                        News Feeds
                      </CardTitle>
                      <CardDescription>External news sources</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Feed
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {feeds.news.length > 0 ? (
                    <div className="space-y-3">
                      {feeds.news.map((feed) => (
                        <div key={feed.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={feed.is_enabled}
                              onCheckedChange={() => toggleFeed("news", feed.id)}
                            />
                            <div>
                              <p className="font-medium text-foreground">{feed.name}</p>
                              <p className="text-xs text-muted-foreground">{feed.url}</p>
                            </div>
                          </div>
                          <Badge variant={feed.is_enabled ? "default" : "secondary"}>
                            {feed.is_enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No news feeds configured</p>
                  )}
                </CardContent>
              </Card>

              {/* Reddit Feeds */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Reddit Feeds
                      </CardTitle>
                      <CardDescription>Subreddit monitoring</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Subreddit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {feeds.reddit.length > 0 ? (
                    <div className="space-y-3">
                      {feeds.reddit.map((feed) => (
                        <div key={feed.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={feed.is_enabled}
                              onCheckedChange={() => toggleFeed("reddit", feed.id)}
                            />
                            <div>
                              <p className="font-medium text-foreground">{feed.name}</p>
                              <p className="text-xs text-muted-foreground">{feed.url}</p>
                            </div>
                          </div>
                          <Badge variant={feed.is_enabled ? "default" : "secondary"}>
                            {feed.is_enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No Reddit feeds configured</p>
                  )}
                </CardContent>
              </Card>

              {/* RSS Feeds */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Rss className="h-5 w-5" />
                        RSS Feeds
                      </CardTitle>
                      <CardDescription>RSS feed subscriptions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add RSS Feed
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {feeds.rss.length > 0 ? (
                    <div className="space-y-3">
                      {feeds.rss.map((feed) => (
                        <div key={feed.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={feed.is_enabled}
                              onCheckedChange={() => toggleFeed("rss", feed.id)}
                            />
                            <div>
                              <p className="font-medium text-foreground">{feed.name}</p>
                              <p className="text-xs text-muted-foreground">{feed.url}</p>
                            </div>
                          </div>
                          <Badge variant={feed.is_enabled ? "default" : "secondary"}>
                            {feed.is_enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No RSS feeds configured</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Manage Categories</CardTitle>
                      <CardDescription>Add, edit, or remove complaint categories</CardDescription>
                    </div>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Property Management", slug: "property-management", count: 8934 },
                      { name: "Landlords", slug: "landlords", count: 3421 },
                      { name: "HOA", slug: "hoa", count: 2156 },
                      { name: "Contractors", slug: "contractors", count: 4532 },
                      { name: "Non-Payment", slug: "non-payment", count: 5678 },
                      { name: "Moving Companies", slug: "moving-companies", count: 2341 },
                      { name: "Electrical Issues", slug: "electrical-issues", count: 1234 },
                      { name: "Plumbing Issues", slug: "plumbing-issues", count: 1567 },
                      { name: "Online Businesses", slug: "online-businesses", count: 3245 },
                      { name: "Mom & Pop Businesses", slug: "mom-and-pop-businesses", count: 1123 },
                    ].map((category) => (
                      <div key={category.slug} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">/categories/{category.slug}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{category.count.toLocaleString()} complaints</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Points Settings Tab */}
            <TabsContent value="points">
              <Card>
                <CardHeader>
                  <CardTitle>Points System Configuration</CardTitle>
                  <CardDescription>Configure how users earn points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points_complaint">Points per Complaint</Label>
                      <Input
                        id="points_complaint"
                        type="number"
                        value={settings.points_per_complaint}
                        onChange={(e) => setSettings(s => ({ ...s, points_per_complaint: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points_comment">Points per Comment</Label>
                      <Input
                        id="points_comment"
                        type="number"
                        value={settings.points_per_comment}
                        onChange={(e) => setSettings(s => ({ ...s, points_per_comment: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points_upvote">Points per Upvote Received</Label>
                      <Input
                        id="points_upvote"
                        type="number"
                        value={settings.points_per_upvote}
                        onChange={(e) => setSettings(s => ({ ...s, points_per_upvote: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 space-y-4">
                    <h3 className="font-medium text-foreground">Platform Settings</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Auto-approve Complaints</p>
                        <p className="text-sm text-muted-foreground">Skip moderation queue for new complaints</p>
                      </div>
                      <Switch
                        checked={settings.auto_approve_complaints}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, auto_approve_complaints: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Require Email Verification</p>
                        <p className="text-sm text-muted-foreground">Users must verify email before posting</p>
                      </div>
                      <Switch
                        checked={settings.require_email_verification}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, require_email_verification: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
