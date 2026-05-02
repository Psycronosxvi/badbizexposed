import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ArrowLeft,
  ThumbsUp, 
  ThumbsDown,
  MessageSquare, 
  Eye,
  Clock,
  MapPin,
  Building2,
  AlertTriangle,
  Share2,
  Flag,
  User
} from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"
import { RightsInsightButton } from "@/components/rights-insight-button"

async function getComplaintData(id: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // Try to fetch complaint from database
  const { data: complaint } = await supabase
    .from('complaints')
    .select(`
      *,
      business:businesses(id, name, slug),
      user:profiles(id, display_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  // Fall back to mock data
  if (!complaint) {
    const mockComplaint = mockComplaints.find(c => c.id === id)
    if (!mockComplaint) {
      return { user: null, complaint: null }
    }
    return {
      user: profile ? { ...profile, email: user?.email } : null,
      complaint: mockComplaint,
    }
  }

  // Get comments
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .eq('complaint_id', id)
    .order('created_at', { ascending: true })

  return {
    user: profile ? { ...profile, email: user?.email } : null,
    complaint: { ...complaint, comments: comments || [] },
  }
}

function getSeverityColor(severity: number) {
  if (severity >= 5) return "bg-destructive text-destructive-foreground"
  if (severity >= 4) return "bg-orange-500 text-white"
  if (severity >= 3) return "bg-yellow-500 text-black"
  return "bg-muted text-muted-foreground"
}

function getSeverityLabel(severity: number) {
  const labels = ['Minor', 'Low', 'Medium', 'High', 'Critical']
  return labels[severity - 1] || 'Unknown'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'open':
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Open</Badge>
    case 'investigating':
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Under Investigation</Badge>
    case 'resolved':
      return <Badge className="bg-success/10 text-success border-success/30">Resolved</Badge>
    case 'closed':
      return <Badge variant="secondary">Closed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, complaint } = await getComplaintData(id)

  if (!complaint) {
    notFound()
  }

  const companyName = complaint.business_name || complaint.business?.name || 'Unknown Company'
  const companySlug = complaint.business_slug || complaint.business?.slug
  const categoryName = typeof complaint.category === 'string' ? complaint.category : complaint.category?.name
  const stateName = typeof complaint.state === 'string' ? complaint.state : complaint.state?.name
  const userName = complaint.user?.display_name || complaint.user?.username || 'Anonymous'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Link href="/complaints">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Complaints
            </Button>
          </Link>

          {/* Main Complaint Card */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              {/* Status and Severity */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={getSeverityColor(complaint.severity)}>
                  {getSeverityLabel(complaint.severity)} Severity
                </Badge>
                {getStatusBadge(complaint.status)}
              </div>

              {/* Title */}
              <CardTitle className="text-2xl mb-4">{complaint.title}</CardTitle>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Link href={companySlug ? `/companies/${companySlug}` : '#'} className="flex items-center gap-1.5 hover:text-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{companyName}</span>
                </Link>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {complaint.city ? `${complaint.city}, ` : ''}{stateName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDate(complaint.created_at)}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Content */}
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-foreground whitespace-pre-wrap">{complaint.content}</p>
              </div>

              {/* Posted By */}
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {complaint.is_anonymous ? 'Anonymous' : userName}
                  </p>
                  <p className="text-sm text-muted-foreground">Complaint Author</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Upvote ({complaint.upvotes || 0})
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsDown className="h-4 w-4" />
                  ({complaint.downvotes || 0})
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
                <RightsInsightButton
                  complaintText={complaint.content || complaint.title}
                  category={categoryName}
                  state={stateName}
                  city={complaint.city}
                />
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-auto">
                  <Eye className="h-4 w-4" />
                  {complaint.view_count || 0} views
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({complaint.comments?.length || complaint.comment_count || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Comment Form */}
              {user ? (
                <form className="mb-6">
                  <Textarea 
                    placeholder="Share your thoughts or experience..."
                    className="mb-3"
                    rows={3}
                  />
                  <Button type="submit">Post Comment</Button>
                </form>
              ) : (
                <div className="p-4 bg-secondary rounded-lg mb-6 text-center">
                  <p className="text-muted-foreground mb-2">Sign in to join the discussion</p>
                  <Link href={`/auth/login?redirect=/complaints/${id}`}>
                    <Button>Sign In</Button>
                  </Link>
                </div>
              )}

              {/* Comments List */}
              {complaint.comments && complaint.comments.length > 0 ? (
                <div className="space-y-4">
                  {complaint.comments.map((comment: {
                    id: string
                    content: string
                    created_at: string
                    user?: { display_name: string; avatar_url?: string }
                  }) => (
                    <div key={comment.id} className="p-4 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {comment.user?.display_name || 'Anonymous'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
