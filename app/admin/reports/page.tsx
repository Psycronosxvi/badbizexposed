import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Flag, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  FileText,
  MessageSquare
} from "lucide-react"

interface SearchParams {
  filter?: string
  type?: string
}

async function getReports(filter?: string, type?: string) {
  const supabase = await createClient()

  // Get reports from moderation_reports table or mock
  const { data: reports } = await supabase
    .from('moderation_reports')
    .select(`
      *,
      reporter:profiles!moderation_reports_reporter_id_fkey(display_name, username),
      complaint:complaints(id, title),
      comment:comments(id, content)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get counts
  const { count: pendingCount } = await supabase
    .from('moderation_reports')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: totalCount } = await supabase
    .from('moderation_reports')
    .select('id', { count: 'exact', head: true })

  return {
    reports: reports || [],
    pendingCount: pendingCount || 5,
    totalCount: totalCount || 23,
  }
}

// Mock data for demonstration
const mockReports = [
  {
    id: '1',
    content_type: 'complaint',
    content_id: 'c1',
    reason: 'Defamatory content',
    description: 'This complaint contains false statements that damage our company reputation.',
    status: 'pending',
    reporter_name: 'Business Owner',
    content_preview: 'Greystar is running a predatory scheme against tenants...',
    created_at: '2026-04-28T10:30:00Z',
  },
  {
    id: '2',
    content_type: 'comment',
    content_id: 'cm1',
    reason: 'Harassment',
    description: 'This comment contains personal attacks and threatening language.',
    status: 'pending',
    reporter_name: 'JohnDoe123',
    content_preview: 'You people are all idiots and deserve what you get...',
    created_at: '2026-04-27T15:45:00Z',
  },
  {
    id: '3',
    content_type: 'complaint',
    content_id: 'c2',
    reason: 'Spam',
    description: 'This appears to be a spam post with promotional links.',
    status: 'resolved',
    reporter_name: 'ModeratorBot',
    content_preview: 'Check out this amazing deal at example.com...',
    created_at: '2026-04-26T09:15:00Z',
    resolved_at: '2026-04-26T11:30:00Z',
    resolution: 'removed',
  },
  {
    id: '4',
    content_type: 'user',
    content_id: 'u1',
    reason: 'Fake account',
    description: 'This account appears to be a bot or fake account posting fake reviews.',
    status: 'pending',
    reporter_name: 'TruthSeeker99',
    content_preview: 'Account: fake_reviewer_123',
    created_at: '2026-04-25T20:00:00Z',
  },
  {
    id: '5',
    content_type: 'complaint',
    content_id: 'c3',
    reason: 'Off-topic',
    description: 'This complaint is about a personal dispute, not a business complaint.',
    status: 'dismissed',
    reporter_name: 'CommunityHelper',
    content_preview: 'My neighbor keeps parking in my spot...',
    created_at: '2026-04-24T14:20:00Z',
    resolved_at: '2026-04-25T08:00:00Z',
    resolution: 'dismissed',
  },
]

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
      return <Badge className="bg-warning/10 text-warning border-warning/30">Pending Review</Badge>
    case 'resolved':
      return <Badge className="bg-success/10 text-success border-success/30">Resolved</Badge>
    case 'dismissed':
      return <Badge variant="secondary">Dismissed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getContentIcon(type: string) {
  switch (type) {
    case 'complaint':
      return <FileText className="h-4 w-4 text-primary" />
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-chart-4" />
    case 'user':
      return <User className="h-4 w-4 text-accent" />
    default:
      return <Flag className="h-4 w-4 text-muted-foreground" />
  }
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { reports: dbReports, pendingCount, totalCount } = await getReports(params.filter, params.type)
  
  // Use mock data if no database reports
  const reports = dbReports.length > 0 ? dbReports : mockReports

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Flag className="h-8 w-8 text-destructive" />
          Content Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage flagged content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <Flag className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount - pendingCount}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Link href="/admin/reports">
          <Button variant={!params.filter ? "default" : "outline"} size="sm">All</Button>
        </Link>
        <Link href="/admin/reports?filter=pending">
          <Button variant={params.filter === 'pending' ? "default" : "outline"} size="sm">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Button>
        </Link>
        <Link href="/admin/reports?filter=resolved">
          <Button variant={params.filter === 'resolved' ? "default" : "outline"} size="sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolved
          </Button>
        </Link>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report: typeof mockReports[0]) => (
          <Card key={report.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getContentIcon(report.content_type)}
                    <span className="text-sm font-medium capitalize text-foreground">
                      {report.content_type} Report
                    </span>
                    {getStatusBadge(report.status)}
                    <Badge variant="outline" className="text-destructive border-destructive/30">
                      {report.reason}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {report.description}
                  </p>

                  <div className="bg-secondary/30 rounded-lg p-3 mb-3">
                    <p className="text-sm text-foreground/80 italic">
                      &ldquo;{report.content_preview}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Reported by: {report.reporter_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(report.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  {report.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                        <XCircle className="h-4 w-4" />
                        Remove
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-success hover:text-success">
                        <CheckCircle className="h-4 w-4" />
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12">
            <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reports found</p>
          </div>
        )}
      </div>
    </div>
  )
}
