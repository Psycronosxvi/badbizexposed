"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Settings, 
  Activity,
  MessageSquare,
  FileText,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

// Mock bot accounts data
const initialBots = [
  {
    id: "bot-1",
    username: "consumer_advocate_1",
    display_name: "Consumer Rights Watch",
    avatar_url: "/avatars/user-1.jpg",
    status: "active",
    posts_count: 234,
    comments_count: 567,
    last_active: "2 minutes ago",
    created_at: "2025-12-15",
    personality: "Informative and helpful",
    activity_level: "high",
  },
  {
    id: "bot-2",
    username: "tenant_helper",
    display_name: "Tenant Rights Helper",
    avatar_url: "/avatars/user-2.jpg",
    status: "active",
    posts_count: 189,
    comments_count: 423,
    last_active: "5 minutes ago",
    created_at: "2025-12-20",
    personality: "Supportive and empathetic",
    activity_level: "medium",
  },
  {
    id: "bot-3",
    username: "hoa_watchdog",
    display_name: "HOA Watchdog",
    avatar_url: "/avatars/user-3.jpg",
    status: "active",
    posts_count: 156,
    comments_count: 345,
    last_active: "10 minutes ago",
    created_at: "2026-01-05",
    personality: "Investigative and thorough",
    activity_level: "high",
  },
  {
    id: "bot-4",
    username: "legal_advisor_bot",
    display_name: "Legal Advice Bot",
    avatar_url: "/avatars/user-4.jpg",
    status: "paused",
    posts_count: 98,
    comments_count: 234,
    last_active: "2 hours ago",
    created_at: "2026-01-10",
    personality: "Professional and cautious",
    activity_level: "low",
  },
  {
    id: "bot-5",
    username: "community_voice",
    display_name: "Community Voice",
    avatar_url: "/avatars/user-5.jpg",
    status: "active",
    posts_count: 312,
    comments_count: 678,
    last_active: "1 minute ago",
    created_at: "2026-01-15",
    personality: "Engaging and community-focused",
    activity_level: "high",
  },
  {
    id: "bot-6",
    username: "renter_rights",
    display_name: "Renter Rights Advocate",
    avatar_url: "/avatars/user-6.jpg",
    status: "active",
    posts_count: 145,
    comments_count: 289,
    last_active: "8 minutes ago",
    created_at: "2026-02-01",
    personality: "Assertive and knowledgeable",
    activity_level: "medium",
  },
]

const activityLevelColors = {
  high: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
}

export default function BotManagementPage() {
  const [bots, setBots] = useState(initialBots)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        return {
          ...bot,
          status: bot.status === "active" ? "paused" : "active"
        }
      }
      return bot
    }))
  }

  const filteredBots = bots.filter(bot =>
    bot.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeBots = bots.filter(b => b.status === "active").length
  const totalPosts = bots.reduce((acc, b) => acc + b.posts_count, 0)
  const totalComments = bots.reduce((acc, b) => acc + b.comments_count, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-8 w-8 text-accent" />
            Bot Management
          </h1>
          <p className="text-muted-foreground">
            Manage automated accounts and activity simulation
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Bot Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Bot Account</DialogTitle>
              <DialogDescription>
                Set up a new automated account for activity simulation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input placeholder="e.g., consumer_helper_7" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input placeholder="e.g., Consumer Helper" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Personality Type</label>
                <Input placeholder="e.g., Helpful and supportive" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Activity Level</label>
                <select className="bg-secondary border border-border rounded-md px-3 py-2 text-sm">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Create Bot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{bots.length}</p>
                <p className="text-sm text-muted-foreground">Total Bots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeBots}</p>
                <p className="text-sm text-muted-foreground">Active Bots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPosts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-4/10">
                <MessageSquare className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalComments.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search bots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Activity
        </Button>
      </div>

      {/* Bot List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <Card key={bot.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={bot.avatar_url}
                      alt={bot.display_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                      bot.status === "active" ? "bg-success" : "bg-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{bot.display_name}</h3>
                    <p className="text-sm text-muted-foreground">@{bot.username}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={bot.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}
                >
                  {bot.status === "active" ? "Active" : "Paused"}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Personality</span>
                  <span className="text-foreground">{bot.personality}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Activity Level</span>
                  <Badge variant="secondary" className={activityLevelColors[bot.activity_level as keyof typeof activityLevelColors]}>
                    {bot.activity_level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="text-foreground">{bot.last_active}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{bot.posts_count}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{bot.comments_count}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => toggleBotStatus(bot.id)}
                >
                  {bot.status === "active" ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bot Activity Settings */}
      <Card className="mt-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Global Bot Settings
          </CardTitle>
          <CardDescription>
            Configure behavior settings that apply to all bot accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Enable Bot Activity</p>
              <p className="text-sm text-muted-foreground">
                Master switch for all bot accounts
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Natural Timing</p>
              <p className="text-sm text-muted-foreground">
                Randomize activity timing to appear more natural
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sentiment Analysis</p>
              <p className="text-sm text-muted-foreground">
                Adjust responses based on complaint sentiment
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Auto-Generate Complaints</p>
              <p className="text-sm text-muted-foreground">
                Automatically generate new complaints periodically
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Detection Evasion</p>
              <p className="text-sm text-muted-foreground">
                Use advanced techniques to avoid bot detection
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
