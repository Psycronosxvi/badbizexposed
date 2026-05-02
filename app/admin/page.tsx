import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Building2, 
  Users, 
  Bot, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  TrendingDown
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

async function getAdminStats() {
  const supabase = await createClient()

  const [complaintsCount, companiesCount, usersCount, discussionsCount] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact', head: true }),
    supabase.from('companies').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('discussions').select('id', { count: 'exact', head: true }),
  ])

  // Get recent activity
  const { data: recentComplaints } = await supabase
    .from('complaints')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalComplaints: complaintsCount.count || 1247,
    totalCompanies: companiesCount.count || 342,
    totalUsers: usersCount.count || 8932,
    totalDiscussions: discussionsCount.count || 423,
    recentComplaints: recentComplaints || [],
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.totalComplaints.toLocaleString(),
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Companies Listed",
      value: stats.totalCompanies.toLocaleString(),
      icon: Building2,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      title: "Registered Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      change: "+23%",
      changeType: "increase" as const,
    },
    {
      title: "Active Discussions",
      value: stats.totalDiscussions.toLocaleString(),
      icon: MessageSquare,
      color: "text-success",
      bgColor: "bg-success/10",
      change: "+5%",
      changeType: "increase" as const,
    },
  ]

  // Mock data for recent activity
  const recentActivity = [
    { type: "complaint", message: "New complaint filed against Greystar", time: "2 minutes ago", status: "pending" },
    { type: "user", message: "New user registered: sarah_m", time: "5 minutes ago", status: "success" },
    { type: "report", message: "Complaint flagged for review", time: "12 minutes ago", status: "warning" },
    { type: "bot", message: "Bot activity detected and logged", time: "15 minutes ago", status: "info" },
    { type: "complaint", message: "Complaint resolved: HOA overcharge", time: "23 minutes ago", status: "success" },
  ]

  const botStats = {
    activeAccounts: 24,
    postsToday: 156,
    commentsToday: 423,
    detected: 3,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of BadBizExposed platform activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge 
                  variant="secondary" 
                  className={stat.changeType === "increase" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {activity.status === "success" && <CheckCircle className="h-5 w-5 text-success" />}
                    {activity.status === "warning" && <AlertTriangle className="h-5 w-5 text-warning" />}
                    {activity.status === "pending" && <Clock className="h-5 w-5 text-primary" />}
                    {activity.status === "info" && <Bot className="h-5 w-5 text-accent" />}
                    <span className="text-sm text-foreground">{activity.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bot Management Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              Bot Activity
            </CardTitle>
            <CardDescription>Automated account management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{botStats.activeAccounts}</p>
                <p className="text-xs text-muted-foreground">Active Bots</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{botStats.postsToday}</p>
                <p className="text-xs text-muted-foreground">Posts Today</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{botStats.commentsToday}</p>
                <p className="text-xs text-muted-foreground">Comments</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{botStats.detected}</p>
                <p className="text-xs text-muted-foreground">Detected</p>
              </div>
            </div>
            <a 
              href="/admin/bots" 
              className="block text-center text-sm text-primary hover:underline"
            >
              Manage Bot Accounts
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 bg-card border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/admin/complaints?filter=pending" 
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-secondary/30 transition-all"
            >
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Review Complaints</span>
              <Badge variant="secondary" className="bg-warning/10 text-warning">12 pending</Badge>
            </a>
            <a 
              href="/admin/reports" 
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-destructive hover:bg-secondary/30 transition-all"
            >
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <span className="text-sm font-medium">Flagged Content</span>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive">5 reports</Badge>
            </a>
            <a 
              href="/admin/bots" 
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-accent hover:bg-secondary/30 transition-all"
            >
              <Bot className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium">Bot Settings</span>
              <Badge variant="secondary">24 active</Badge>
            </a>
            <a 
              href="/admin/users" 
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-chart-4 hover:bg-secondary/30 transition-all"
            >
              <Users className="h-8 w-8 text-chart-4" />
              <span className="text-sm font-medium">Manage Users</span>
              <Badge variant="secondary" className="bg-success/10 text-success">+23 today</Badge>
            </a>
            <a 
              href="/admin/reviews" 
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-orange-500 hover:bg-secondary/30 transition-all"
            >
              <TrendingDown className="h-8 w-8 text-orange-500" />
              <span className="text-sm font-medium">Review Tracking</span>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">3 properties</Badge>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
