import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { 
  FileText, 
  Search, 
  ThumbsUp, 
  MessageSquare, 
  Eye,
  AlertTriangle,
  Filter,
  Plus,
  Clock
} from "lucide-react"
import { mockComplaints, mockCategories, mockStates } from "@/lib/mock-data"

interface SearchParams {
  category?: string
  state?: string
  severity?: string
  q?: string
}

async function getComplaintsData(params: SearchParams) {
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

  // Try to fetch complaints from database
  let query = supabase
    .from('complaints')
    .select(`
      *,
      company:companies(name, slug),
      category:categories(name, slug),
      state:states(name, abbreviation),
      user:profiles(display_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  if (params.category && params.category !== 'all') {
    query = query.eq('category_id', params.category)
  }
  if (params.state && params.state !== 'all') {
    query = query.eq('state_id', params.state)
  }
  if (params.severity && params.severity !== 'all') {
    query = query.eq('severity', parseInt(params.severity))
  }

  const { data: complaints } = await query

  // Get categories and states for filters
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  const { data: states } = await supabase.from('states').select('*').order('name')

  return {
    user: profile ? { ...profile, email: user?.email } : null,
    complaints: complaints?.length ? complaints : mockComplaints,
    categories: categories?.length ? categories : mockCategories,
    states: states?.length ? states : mockStates,
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

function getStatusColor(status: string) {
  switch (status) {
    case 'open': return "bg-blue-500/10 text-blue-500 border-blue-500/30"
    case 'investigating': return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
    case 'resolved': return "bg-success/10 text-success border-success/30"
    case 'closed': return "bg-muted text-muted-foreground border-border"
    default: return "bg-muted text-muted-foreground border-border"
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
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { user, complaints, categories, states } = await getComplaintsData(params)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Complaints
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and search consumer complaints
              </p>
            </div>
            <Link href="/submit">
              <Button variant="destructive" className="gap-2">
                <Plus className="h-4 w-4" />
                File a Complaint
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-card border-border">
            <CardContent className="pt-6">
              <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="q"
                    placeholder="Search complaints..."
                    defaultValue={params.q}
                    className="pl-10 bg-secondary"
                  />
                </div>
                <Select name="category" defaultValue={params.category || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat: { id: string; name: string }) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="state" defaultValue={params.state || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state: { id: string; name: string }) => (
                      <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Complaints List */}
          <div className="space-y-4">
            {complaints.map((complaint: {
              id: string
              title: string
              content: string
              company_name?: string
              company?: { name: string; slug: string }
              company_slug?: string
              category?: string | { name: string }
              state?: string | { name: string }
              city?: string
              severity: number
              status: string
              upvotes?: number
              downvotes?: number
              comment_count?: number
              view_count?: number
              created_at: string
              user?: { display_name: string } | { username: string }
            }) => (
              <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <Badge className={getSeverityColor(complaint.severity)}>
                            {getSeverityLabel(complaint.severity)}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {complaint.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {complaint.content}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {complaint.company_name || complaint.company?.name}
                          </span>
                          <span>•</span>
                          <span>{typeof complaint.category === 'string' ? complaint.category : complaint.category?.name}</span>
                          <span>•</span>
                          <span>
                            {complaint.city ? `${complaint.city}, ` : ''}
                            {typeof complaint.state === 'string' ? complaint.state : complaint.state?.name}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex lg:flex-col items-center gap-4 lg:gap-2 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{complaint.upvotes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4" />
                          <span>{complaint.comment_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          <span>{complaint.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(complaint.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {complaints.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No complaints found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or be the first to file a complaint.
                </p>
                <Link href="/submit">
                  <Button variant="destructive" className="gap-2">
                    <Plus className="h-4 w-4" />
                    File a Complaint
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
