import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react"

interface SearchParams {
  filter?: string
  page?: string
}

async function getComplaints(filter: string = 'all') {
  const supabase = await createClient()

  let query = supabase
    .from('complaints')
    .select(`
      *,
      business:businesses(name, slug),
      user:profiles(display_name, email:id)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (filter === 'pending') {
    query = query.eq('status', 'pending')
  } else if (filter === 'approved') {
    query = query.eq('status', 'open')
  } else if (filter === 'rejected') {
    query = query.eq('status', 'rejected')
  } else if (filter === 'flagged') {
    query = query.eq('is_flagged', true)
  }

  const { data: complaints } = await query

  // Get counts
  const { count: pendingCount } = await supabase
    .from('complaints')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: flaggedCount } = await supabase
    .from('complaints')
    .select('id', { count: 'exact', head: true })
    .eq('is_flagged', true)

  return {
    complaints: complaints || [],
    pendingCount: pendingCount || 0,
    flaggedCount: flaggedCount || 0,
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Pending</Badge>
    case 'open':
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Approved</Badge>
    case 'rejected':
      return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>
    case 'investigating':
      return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30">Investigating</Badge>
    case 'resolved':
      return <Badge className="bg-success/10 text-success border-success/30">Resolved</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const filter = params.filter || 'all'
  const { complaints, pendingCount, flaggedCount } = await getComplaints(filter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Complaint Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Review, approve, and manage user complaints
        </p>
      </div>

      {/* Alert Badges */}
      <div className="flex gap-4 mb-6">
        <Link href="/admin/complaints?filter=pending">
          <Badge variant="secondary" className="px-4 py-2 text-base cursor-pointer hover:bg-yellow-500/20 bg-yellow-500/10 text-yellow-600">
            <Clock className="h-4 w-4 mr-2" />
            {pendingCount} Pending Approval
          </Badge>
        </Link>
        <Link href="/admin/complaints?filter=flagged">
          <Badge variant="secondary" className="px-4 py-2 text-base cursor-pointer hover:bg-destructive/20 bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {flaggedCount} Flagged
          </Badge>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={filter} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" asChild>
            <Link href="/admin/complaints?filter=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/admin/complaints?filter=pending">Pending</Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link href="/admin/complaints?filter=approved">Approved</Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link href="/admin/complaints?filter=rejected">Rejected</Link>
          </TabsTrigger>
          <TabsTrigger value="flagged" asChild>
            <Link href="/admin/complaints?filter=flagged">Flagged</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Complaints Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Complaint</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Engagement</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {complaints.map((complaint: {
                  id: string
                  title: string
                  content: string
                  status: string
                  severity: number
                  upvotes: number
                  downvotes: number
                  comment_count: number
                  is_flagged: boolean
                  is_anonymous: boolean
                  created_at: string
                  company?: { name: string; slug: string }
                  user?: { display_name: string; username: string }
                  category?: { name: string }
                }) => (
                  <tr key={complaint.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <Link href={`/complaints/${complaint.id}`} className="font-medium text-foreground hover:text-primary">
                          {complaint.title}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {complaint.content.substring(0, 80)}...
                        </p>
                        {complaint.is_flagged && (
                          <Badge variant="destructive" className="mt-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {complaint.business ? (
                        <Link href={`/business/${complaint.business.slug}`} className="text-primary hover:underline">
                          {complaint.business.name}
                        </Link>
                      ) : complaint.business_name ? (
                        <span className="text-foreground">{complaint.business_name}</span>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">
                        {complaint.is_anonymous ? 'Anonymous' : complaint.user?.display_name || 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {complaint.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3" />
                          {complaint.downvotes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {complaint.comment_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatTimeAgo(complaint.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/complaints/${complaint.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {complaint.status === 'pending' && (
                          <>
                            <form action={`/api/admin/complaints/${complaint.id}/approve`} method="POST">
                              <Button type="submit" variant="ghost" size="sm" className="text-success hover:text-success">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </form>
                            <form action={`/api/admin/complaints/${complaint.id}/reject`} method="POST">
                              <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {complaints.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No complaints found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
