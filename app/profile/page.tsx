import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { redirect } from "next/navigation"
import { 
  User, 
  FileText, 
  MessageSquare, 
  ThumbsUp,
  Calendar,
  MapPin,
  Globe,
  Settings,
  Award,
  Star,
  Shield,
  Crown,
  Eye
} from "lucide-react"

// Badge definitions
const badgeDefinitions = [
  { id: "first_complaint", name: "First Report", icon: FileText, threshold: 1 },
  { id: "active_reporter", name: "Active Reporter", icon: Star, threshold: 5 },
  { id: "top_contributor", name: "Top Contributor", icon: Award, threshold: 25 },
  { id: "community_voice", name: "Community Voice", icon: ThumbsUp, threshold: 100 },
  { id: "verified_reporter", name: "Verified Reporter", icon: Shield, threshold: 10 },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function getProfileData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/profile')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's complaints
  const { data: complaints } = await supabase
    .from('complaints')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get user's comments
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      complaint:complaints(id, title)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate stats
  const totalComplaints = complaints?.length || 0
  const totalUpvotes = complaints?.reduce((sum, c) => sum + (c.upvotes || 0), 0) || 0
  const totalViews = complaints?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0

  return {
    user: { ...profile, email: user.email },
    complaints: complaints || [],
    comments: comments || [],
    stats: {
      totalComplaints,
      totalComments: comments?.length || 0,
      totalUpvotes,
      totalViews,
      points: profile?.points || 0,
    }
  }
}

export default async function ProfilePage() {
  const { user, complaints, comments, stats } = await getProfileData()

  const earnedBadges = badgeDefinitions.filter(b => stats.totalComplaints >= b.threshold)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Profile Header */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {user.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {user.display_name || user.email?.split('@')[0] || 'User'}
                    </h1>
                    {user.is_premium && (
                      <Badge className="w-fit gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                    {user.is_verified && (
                      <Badge className="w-fit gap-1 bg-blue-500/10 text-blue-500 border-blue-500/30">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  {user.bio && (
                    <p className="text-muted-foreground mb-3">{user.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </span>
                    )}
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {user.created_at ? formatDate(user.created_at) : 'Recently'}
                    </span>
                  </div>
                </div>

                <Link href="/settings">
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.points.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalComplaints}</p>
                <p className="text-sm text-muted-foreground">Complaints</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalComments}</p>
                <p className="text-sm text-muted-foreground">Comments</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalUpvotes}</p>
                <p className="text-sm text-muted-foreground">Upvotes</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalViews}</p>
                <p className="text-sm text-muted-foreground">Views</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <Card className="bg-card border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Earned Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {earnedBadges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <Badge key={badge.id} variant="secondary" className="gap-2 py-2 px-3">
                        <Icon className="h-4 w-4 text-primary" />
                        {badge.name}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Tabs */}
          <Tabs defaultValue="complaints">
            <TabsList className="mb-4">
              <TabsTrigger value="complaints" className="gap-2">
                <FileText className="h-4 w-4" />
                Complaints ({stats.totalComplaints})
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({stats.totalComments})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="complaints">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  {complaints.length > 0 ? (
                    <div className="space-y-4">
                      {complaints.map((complaint: {
                        id: string
                        title: string
                        business_name: string
                        status: string
                        upvotes: number
                        view_count: number
                        created_at: string
                      }) => (
                        <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                          <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-foreground line-clamp-1">
                                {complaint.title}
                              </h3>
                              <Badge variant="outline">{complaint.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {complaint.business_name}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {complaint.upvotes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {complaint.view_count || 0}
                              </span>
                              <span>{formatDate(complaint.created_at)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No complaints filed yet</p>
                      <Link href="/submit">
                        <Button variant="destructive">File Your First Complaint</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment: {
                        id: string
                        content: string
                        upvotes: number
                        created_at: string
                        complaint?: { id: string; title: string }
                      }) => (
                        <Link href={comment.complaint ? `/complaints/${comment.complaint.id}` : '#'} key={comment.id}>
                          <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <p className="text-foreground line-clamp-2 mb-2">{comment.content}</p>
                            {comment.complaint && (
                              <p className="text-sm text-muted-foreground mb-2">
                                On: {comment.complaint.title}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {comment.upvotes || 0}
                              </span>
                              <span>{formatDate(comment.created_at)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No comments yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
