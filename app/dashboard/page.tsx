import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { redirect } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  ThumbsUp,
  Eye,
  Plus,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  User,
  Star,
  Award,
  Shield,
  Crown,
  History
} from "lucide-react"

// Badge definitions
const badgeDefinitions = [
  { id: "first_complaint", name: "First Report", description: "Submitted your first complaint", icon: FileText, threshold: 1 },
  { id: "active_reporter", name: "Active Reporter", description: "Submitted 5+ complaints", icon: Star, threshold: 5 },
  { id: "top_contributor", name: "Top Contributor", description: "Submitted 25+ complaints", icon: Award, threshold: 25 },
  { id: "community_voice", name: "Community Voice", description: "Received 100+ upvotes", icon: ThumbsUp, threshold: 100 },
  { id: "verified_reporter", name: "Verified Reporter", description: "Email verified with 10+ complaints", icon: Shield, threshold: 10 },
]

async function getDashboardData() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's complaints
  const { data: complaints } = await supabase
    .from('complaints')
    .select(`
      *,
      company:companies(name, slug),
      category:categories(name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get user's comment count
  const { count: commentCount } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get points history
  const { data: pointsHistory } = await supabase
    .from('points_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate stats
  const totalComplaints = complaints?.length || 0
  const totalUpvotes = complaints?.reduce((sum, c) => sum + (c.upvotes || 0), 0) || 0
  const totalViews = complaints?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0
  const userPoints = profile?.points || 0
  const userBadges = profile?.badges || []
  const isPremium = profile?.is_premium || false

  // Calculate next badge
  const nextBadge = badgeDefinitions.find(b => totalComplaints < b.threshold)
  const progressToNextBadge = nextBadge 
    ? Math.min((totalComplaints / nextBadge.threshold) * 100, 100)
    : 100

  return {
    user: { ...profile, email: user.email },
    complaints: complaints || [],
    stats: {
      totalComplaints,
      totalComments: commentCount || 0,
      totalUpvotes,
      totalViews,
      userPoints,
    },
    pointsHistory: pointsHistory || [],
    userBadges,
    isPremium,
    nextBadge,
    progressToNextBadge,
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'open':
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Open</Badge>
    case 'investigating':
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Investigating</Badge>
    case 'resolved':
      return <Badge className="bg-success/10 text-success border-success/30">Resolved</Badge>
    case 'closed':
      return <Badge variant="secondary">Closed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default async function DashboardPage() {
  const { user, complaints, stats, pointsHistory, userBadges, isPremium, nextBadge, progressToNextBadge } = await getDashboardData()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.display_name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isPremium && (
                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              )}
              <Link href="/submit">
                <Button variant="destructive" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Complaint
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-500/10">
                    <Star className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.userPoints.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalComplaints}</p>
                    <p className="text-sm text-muted-foreground">Complaints Filed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/10">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalComments}</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-success/10">
                    <ThumbsUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalUpvotes}</p>
                    <p className="text-sm text-muted-foreground">Upvotes Received</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-chart-4/10">
                    <Eye className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalViews}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Complaints */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Complaints</CardTitle>
                    <CardDescription>Your recent complaint submissions</CardDescription>
                  </div>
                  <Link href="/complaints?mine=true">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {complaints.length > 0 ? (
                    <div className="space-y-4">
                      {complaints.map((complaint: {
                        id: string
                        title: string
                        status: string
                        upvotes: number
                        comment_count: number
                        view_count: number
                        created_at: string
                        company?: { name: string }
                      }) => (
                        <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                          <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-foreground line-clamp-1">
                                {complaint.title}
                              </h3>
                              {getStatusBadge(complaint.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{complaint.company?.name || 'Unknown Company'}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {complaint.upvotes || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {complaint.comment_count || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(complaint.created_at)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {"You haven't filed any complaints yet"}
                      </p>
                      <Link href="/submit">
                        <Button variant="destructive" className="gap-2">
                          <Plus className="h-4 w-4" />
                          File Your First Complaint
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/submit">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      File a Complaint
                    </Button>
                  </Link>
                  <Link href="/companies">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Browse Companies
                    </Button>
                  </Link>
                  <Link href="/trending">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Bell className="h-4 w-4" />
                      View Trending
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Progress to Next Badge */}
              {nextBadge && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Next Badge</CardTitle>
                    <CardDescription>
                      {nextBadge.threshold - stats.totalComplaints} more to unlock
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <nextBadge.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{nextBadge.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {stats.totalComplaints} / {nextBadge.threshold}
                          </span>
                        </div>
                        <Progress value={progressToNextBadge} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Your Badges */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {badgeDefinitions.map((badge) => {
                      const isEarned = userBadges.includes(badge.id) || stats.totalComplaints >= badge.threshold
                      const Icon = badge.icon
                      return (
                        <div
                          key={badge.id}
                          className={`flex flex-col items-center p-2 rounded-lg border text-center ${
                            isEarned ? "border-primary bg-primary/5" : "border-border opacity-40"
                          }`}
                          title={badge.description}
                        >
                          <Icon className={`h-5 w-5 mb-1 ${isEarned ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-xs font-medium leading-tight">{badge.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Points History */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Points History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pointsHistory.length > 0 ? (
                    <div className="space-y-3">
                      {pointsHistory.map((entry: { id: string; reason: string; points: number; created_at: string }) => (
                        <div key={entry.id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-foreground">{entry.reason}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`font-medium ${entry.points > 0 ? "text-green-500" : "text-red-500"}`}>
                            {entry.points > 0 ? "+" : ""}{entry.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Submit complaints to earn points!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Premium Upgrade CTA */}
              {!isPremium && (
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Crown className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Go Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Boost visibility and unlock features
                    </p>
                    <Link href="/pricing">
                      <Button className="w-full">Upgrade $1.99/mo</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Account Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground truncate ml-2">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="text-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      {isPremium ? "Premium" : "Free"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
