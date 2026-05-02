"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Shield, 
  ShieldAlert,
  ShieldCheck,
  Users, 
  Activity,
  AlertTriangle,
  Search,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  LogIn,
  LogOut,
  UserPlus,
  Key,
  Flag,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  UserX,
  UserCheck,
  Zap
} from "lucide-react"

// Types
interface SecurityStats {
  totalUsers: number
  activeSessions: number
  suspiciousUsers: number
  flaggedUsers: number
  failedLogins24h: number
  newUsers24h: number
  newUsers7d: number
  newUsers30d: number
}

interface SecurityEvent {
  id: string
  user_id: string | null
  event_type: string
  event_category: string
  ip_address: string | null
  device_type: string | null
  browser: string | null
  country: string | null
  is_suspicious: boolean
  risk_score: number
  created_at: string
  metadata: Record<string, unknown>
  user?: {
    display_name: string | null
    email: string | null
    avatar_url: string | null
  }
}

interface UserIntel {
  id: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  trust_score: number
  security_status: string
  is_verified: boolean
  email_verified: boolean
  is_banned: boolean
  login_count: number
  failed_login_count: number
  suspicious_activity_count: number
  last_login_at: string | null
  last_ip_address: string | null
  created_at: string
  flagged_at: string | null
  flag_reason: string | null
}

interface ActiveSession {
  id: string
  user_id: string
  ip_address: string | null
  device_type: string | null
  browser: string | null
  country: string | null
  started_at: string
  last_active_at: string
  user?: {
    display_name: string | null
    email: string | null
  }
}

// Trust score badge component
function TrustScoreBadge({ score }: { score: number }) {
  let color = "bg-success/10 text-success border-success/30"
  let label = "Trusted"
  
  if (score < 30) {
    color = "bg-destructive/10 text-destructive border-destructive/30"
    label = "High Risk"
  } else if (score < 50) {
    color = "bg-warning/10 text-warning border-warning/30"
    label = "Suspicious"
  } else if (score < 70) {
    color = "bg-chart-4/10 text-chart-4 border-chart-4/30"
    label = "Normal"
  }

  return (
    <Badge variant="outline" className={color}>
      {score} - {label}
    </Badge>
  )
}

// Security status badge
function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    VERIFIED: { color: "bg-success/10 text-success", icon: <ShieldCheck className="h-3 w-3" /> },
    TRUSTED: { color: "bg-chart-4/10 text-chart-4", icon: <CheckCircle className="h-3 w-3" /> },
    NEW_USER: { color: "bg-primary/10 text-primary", icon: <UserPlus className="h-3 w-3" /> },
    SUSPICIOUS: { color: "bg-warning/10 text-warning", icon: <AlertTriangle className="h-3 w-3" /> },
    FLAGGED: { color: "bg-destructive/10 text-destructive", icon: <Flag className="h-3 w-3" /> },
  }

  const config = statusConfig[status] || statusConfig.NEW_USER

  return (
    <Badge variant="secondary" className={`gap-1 ${config.color}`}>
      {config.icon}
      {status.replace('_', ' ')}
    </Badge>
  )
}

export default function SecurityCommandCenter() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [users, setUsers] = useState<UserIntel[]>([])
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserIntel | null>(null)
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [flagReason, setFlagReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const supabase = createClient()

  // Load security stats
  const loadStats = async () => {
    try {
      const [
        usersCount,
        sessionsCount,
        suspiciousCount,
        flaggedCount,
        failedLoginsCount,
        newUsers24hCount,
        newUsers7dCount,
        newUsers30dCount
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_sessions').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('security_status', 'SUSPICIOUS'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).not('flagged_at', 'is', null),
        supabase.from('security_events').select('id', { count: 'exact', head: true })
          .eq('event_type', 'login_failed')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ])

      setStats({
        totalUsers: usersCount.count || 0,
        activeSessions: sessionsCount.count || 0,
        suspiciousUsers: suspiciousCount.count || 0,
        flaggedUsers: flaggedCount.count || 0,
        failedLogins24h: failedLoginsCount.count || 0,
        newUsers24h: newUsers24hCount.count || 0,
        newUsers7d: newUsers7dCount.count || 0,
        newUsers30d: newUsers30dCount.count || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  // Load security events
  const loadEvents = async () => {
    try {
      const { data } = await supabase
        .from('security_events')
        .select(`
          *,
          user:profiles(display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      setEvents(data || [])
    } catch (error) {
      console.error("Error loading events:", error)
    }
  }

  // Load users with security info
  const loadUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (userFilter === 'suspicious') {
        query = query.eq('security_status', 'SUSPICIOUS')
      } else if (userFilter === 'flagged') {
        query = query.not('flagged_at', 'is', null)
      } else if (userFilter === 'verified') {
        query = query.eq('is_verified', true)
      } else if (userFilter === 'new') {
        query = query.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      }

      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      }

      const { data } = await query
      setUsers(data || [])
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  // Load active sessions
  const loadSessions = async () => {
    try {
      const { data } = await supabase
        .from('user_sessions')
        .select(`
          *,
          user:profiles(display_name, email)
        `)
        .eq('is_active', true)
        .order('last_active_at', { ascending: false })
        .limit(50)

      setSessions(data || [])
    } catch (error) {
      console.error("Error loading sessions:", error)
    }
  }

  // Flag user
  const flagUser = async () => {
    if (!selectedUser) return

    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from('profiles')
        .update({
          security_status: 'FLAGGED',
          flagged_at: new Date().toISOString(),
          flagged_by: user?.id,
          flag_reason: flagReason,
          trust_score: Math.max(0, (selectedUser.trust_score || 50) - 30),
        })
        .eq('id', selectedUser.id)

      // Log security event
      await supabase.from('security_events').insert({
        user_id: selectedUser.id,
        event_type: 'user_flagged',
        event_category: 'admin',
        metadata: { reason: flagReason, flagged_by: user?.id }
      })

      setFlagDialogOpen(false)
      setFlagReason("")
      setSelectedUser(null)
      loadUsers()
      loadStats()
    } catch (error) {
      console.error("Error flagging user:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Unflag user
  const unflagUser = async (userId: string) => {
    setIsProcessing(true)
    try {
      await supabase
        .from('profiles')
        .update({
          security_status: 'NEW_USER',
          flagged_at: null,
          flagged_by: null,
          flag_reason: null,
        })
        .eq('id', userId)

      loadUsers()
      loadStats()
    } catch (error) {
      console.error("Error unflagging user:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true)
      await Promise.all([loadStats(), loadEvents(), loadUsers(), loadSessions()])
      setIsLoading(false)
    }
    loadAll()
  }, [])

  // Reload users when filter changes
  useEffect(() => {
    loadUsers()
  }, [userFilter, searchQuery])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="h-4 w-4 text-success" />
      case 'logout': return <LogOut className="h-4 w-4 text-muted-foreground" />
      case 'login_failed': return <XCircle className="h-4 w-4 text-destructive" />
      case 'password_change': return <Key className="h-4 w-4 text-warning" />
      case 'account_created': return <UserPlus className="h-4 w-4 text-primary" />
      case 'user_flagged': return <Flag className="h-4 w-4 text-destructive" />
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4 text-warning" />
      default: return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getDeviceIcon = (type: string | null) => {
    if (type === 'mobile') return <Smartphone className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Security Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor platform security, detect threats, and manage user trust
          </p>
        </div>
        <Button onClick={() => { loadStats(); loadEvents(); loadUsers(); loadSessions(); }} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Intel
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Event Log
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Globe className="h-4 w-4" />
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.activeSessions}</p>
                    <p className="text-xs text-muted-foreground">Active Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.suspiciousUsers}</p>
                    <p className="text-xs text-muted-foreground">Suspicious</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.failedLogins24h}</p>
                    <p className="text-xs text-muted-foreground">Failed Logins (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Registrations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                New Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-foreground">{stats?.newUsers24h}</p>
                  <p className="text-sm text-muted-foreground">Last 24 Hours</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-foreground">{stats?.newUsers7d}</p>
                  <p className="text-sm text-muted-foreground">Last 7 Days</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-3xl font-bold text-foreground">{stats?.newUsers30d}</p>
                  <p className="text-sm text-muted-foreground">Last 30 Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {(stats?.suspiciousUsers || 0) > 0 || (stats?.flaggedUsers || 0) > 0 ? (
            <Card className="bg-destructive/5 border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(stats?.suspiciousUsers || 0) > 0 && (
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <span className="text-sm">{stats?.suspiciousUsers} users flagged as suspicious</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setUserFilter('suspicious'); setActiveTab('users'); }}>
                      Review
                    </Button>
                  </div>
                )}
                {(stats?.flaggedUsers || 0) > 0 && (
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Flag className="h-5 w-5 text-destructive" />
                      <span className="text-sm">{stats?.flaggedUsers} users require admin review</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setUserFilter('flagged'); setActiveTab('users'); }}>
                      Review
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-success/5 border-success/30">
              <CardContent className="py-8 text-center">
                <ShieldCheck className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="text-lg font-medium text-success">All Clear</p>
                <p className="text-sm text-muted-foreground">No security alerts at this time</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={userFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setUserFilter('all')}>All</Button>
              <Button variant={userFilter === 'verified' ? 'default' : 'outline'} size="sm" onClick={() => setUserFilter('verified')}>Verified</Button>
              <Button variant={userFilter === 'suspicious' ? 'default' : 'outline'} size="sm" onClick={() => setUserFilter('suspicious')}>Suspicious</Button>
              <Button variant={userFilter === 'flagged' ? 'default' : 'outline'} size="sm" onClick={() => setUserFilter('flagged')}>Flagged</Button>
              <Button variant={userFilter === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setUserFilter('new')}>New</Button>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Trust Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Activity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Login</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary/30">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback>
                                {(user.display_name || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.display_name || 'Anonymous'}</p>
                              <p className="text-xs text-muted-foreground">{user.email || user.id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <TrustScoreBadge score={user.trust_score || 50} />
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={user.security_status || 'NEW_USER'} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <LogIn className="h-3 w-3" />
                              {user.login_count || 0}
                            </span>
                            {(user.failed_login_count || 0) > 0 && (
                              <span className="flex items-center gap-1 text-destructive">
                                <XCircle className="h-3 w-3" />
                                {user.failed_login_count}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.flagged_at ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-success"
                                onClick={() => unflagUser(user.id)}
                                disabled={isProcessing}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-warning"
                                onClick={() => { setSelectedUser(user); setFlagDialogOpen(true); }}
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                            )}
                            {!user.is_banned && (
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Security Event Log</CardTitle>
              <CardDescription>Immutable audit trail of security-related events</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No security events recorded yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {events.map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-4 hover:bg-secondary/30 ${event.is_suspicious ? 'bg-warning/5' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-secondary/50">
                            {getEventIcon(event.event_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground capitalize">
                                {event.event_type.replace(/_/g, ' ')}
                              </span>
                              {event.is_suspicious && (
                                <Badge variant="secondary" className="bg-warning/10 text-warning">
                                  Suspicious
                                </Badge>
                              )}
                              {event.risk_score > 50 && (
                                <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                                  Risk: {event.risk_score}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {event.user?.display_name && (
                                <span>User: {event.user.display_name}</span>
                              )}
                              {event.ip_address && (
                                <span className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {event.ip_address}
                                </span>
                              )}
                              {event.device_type && (
                                <span className="flex items-center gap-1">
                                  {getDeviceIcon(event.device_type)}
                                  {event.browser}
                                </span>
                              )}
                              {event.country && (
                                <span>{event.country}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0">
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Active Sessions
              </CardTitle>
              <CardDescription>Currently active user sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active sessions</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-secondary/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-success/10">
                            {getDeviceIcon(session.device_type)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {session.user?.display_name || 'Unknown User'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {session.ip_address && (
                                <span>{session.ip_address}</span>
                              )}
                              {session.browser && (
                                <span>{session.browser}</span>
                              )}
                              {session.country && (
                                <span>{session.country}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-foreground">
                            Active {new Date(session.last_active_at).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Started {new Date(session.started_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Flag User Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-warning" />
              Flag User for Review
            </DialogTitle>
            <DialogDescription>
              This will mark the user for admin review and reduce their trust score.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedUser && (
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback>
                    {(selectedUser.display_name || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.display_name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">
                Reason for flagging
              </label>
              <Textarea
                placeholder="Describe the suspicious behavior or reason for flagging..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={flagUser}
              disabled={isProcessing || !flagReason.trim()}
              className="gap-2 bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Flag className="h-4 w-4" />
              )}
              Flag User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
