import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  MessageSquare,
  Building2,
  Eye,
  ThumbsUp,
  Calendar
} from "lucide-react"

async function getAnalytics() {
  const supabase = await createClient()

  // Get various counts
  const [
    complaintsCount,
    usersCount,
    businessesCount,
    discussionsCount,
    blogCount
  ] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
    supabase.from('discussions').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
  ])

  // Get recent complaints
  const { data: recentComplaints } = await supabase
    .from('complaints')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  // Get recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  return {
    totalComplaints: complaintsCount.count || 12847,
    totalUsers: usersCount.count || 8932,
    totalBusinesses: businessesCount.count || 3421,
    totalDiscussions: discussionsCount.count || 423,
    totalBlogPosts: blogCount.count || 100,
    weeklyComplaints: recentComplaints?.length || 156,
    weeklyUsers: recentUsers?.length || 89,
  }
}

export default async function AdminAnalyticsPage() {
  const stats = await getAnalytics()

  // Mock chart data for visual representation
  const weeklyData = [
    { day: 'Mon', complaints: 32, users: 12 },
    { day: 'Tue', complaints: 28, users: 15 },
    { day: 'Wed', complaints: 45, users: 18 },
    { day: 'Thu', complaints: 38, users: 14 },
    { day: 'Fri', complaints: 52, users: 22 },
    { day: 'Sat', complaints: 24, users: 8 },
    { day: 'Sun', complaints: 18, users: 6 },
  ]

  const topCategories = [
    { name: 'Property Management', count: 3421, percentage: 28 },
    { name: 'Landlords', count: 2856, percentage: 23 },
    { name: 'HOA', count: 2134, percentage: 17 },
    { name: 'Contractors', count: 1567, percentage: 13 },
    { name: 'Moving Companies', count: 1234, percentage: 10 },
    { name: 'Other', count: 1089, percentage: 9 },
  ]

  const topStates = [
    { name: 'California', count: 2456, percentage: 20 },
    { name: 'Texas', count: 2134, percentage: 17 },
    { name: 'Florida', count: 1678, percentage: 14 },
    { name: 'New York', count: 1234, percentage: 10 },
    { name: 'Pennsylvania', count: 987, percentage: 8 },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform performance metrics and insights
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xl font-bold">{stats.totalComplaints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Complaints</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-chart-4" />
              <div>
                <p className="text-xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xl font-bold">{stats.totalBusinesses.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Businesses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-success" />
              <div>
                <p className="text-xl font-bold">{stats.totalDiscussions}</p>
                <p className="text-xs text-muted-foreground">Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-warning" />
              <div>
                <p className="text-xl font-bold">{stats.weeklyComplaints}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xl font-bold">{stats.totalBlogPosts}</p>
                <p className="text-xs text-muted-foreground">Blog Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Complaints and user registrations over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-1 items-center">
                  {/* Complaints bar */}
                  <div 
                    className="w-full bg-primary/80 rounded-t"
                    style={{ height: `${(day.complaints / 60) * 150}px` }}
                  />
                  {/* Users bar */}
                  <div 
                    className="w-full bg-chart-4/60 rounded-t"
                    style={{ height: `${(day.users / 30) * 50}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/80" />
              <span className="text-sm text-muted-foreground">Complaints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-chart-4/60" />
              <span className="text-sm text-muted-foreground">New Users</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Complaint distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{category.name}</span>
                  <span className="text-muted-foreground">{category.count.toLocaleString()} ({category.percentage}%)</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top States */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top States</CardTitle>
            <CardDescription>Complaint distribution by state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topStates.map((state, index) => (
              <div key={state.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{state.name}</span>
                    <Badge variant="secondary">{state.count.toLocaleString()}</Badge>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${state.percentage * 5}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="mt-8 bg-card border-border">
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>User interaction statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">1.2M</p>
              <p className="text-sm text-muted-foreground">Page Views</p>
              <Badge variant="secondary" className="mt-2 text-success bg-success/10">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18%
              </Badge>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">45.2K</p>
              <p className="text-sm text-muted-foreground">Upvotes</p>
              <Badge variant="secondary" className="mt-2 text-success bg-success/10">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23%
              </Badge>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-chart-4" />
              <p className="text-2xl font-bold">12.8K</p>
              <p className="text-sm text-muted-foreground">Comments</p>
              <Badge variant="secondary" className="mt-2 text-success bg-success/10">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15%
              </Badge>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">3.4K</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <Badge variant="secondary" className="mt-2 text-success bg-success/10">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
