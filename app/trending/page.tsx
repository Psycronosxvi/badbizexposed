import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  TrendingUp, 
  ThumbsUp, 
  MessageSquare, 
  Eye,
  Flame,
  Clock,
  ArrowUp,
  Building2
} from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"

async function getTrendingData() {
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

  // Try to fetch trending complaints (sorted by upvotes)
  const { data: complaints } = await supabase
    .from('complaints')
    .select(`
      *,
      company:companies(name, slug),
      category:categories(name),
      state:states(name)
    `)
    .order('upvotes', { ascending: false })
    .limit(20)

  // Get trending companies
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('complaint_count', { ascending: false })
    .limit(10)

  return {
    user: profile ? { ...profile, email: user?.email } : null,
    complaints: complaints?.length ? complaints : mockComplaints.sort((a, b) => b.upvotes - a.upvotes),
    companies: companies || [],
  }
}

function getSeverityColor(severity: number) {
  if (severity >= 5) return "bg-destructive text-destructive-foreground"
  if (severity >= 4) return "bg-orange-500 text-white"
  if (severity >= 3) return "bg-yellow-500 text-black"
  return "bg-muted text-muted-foreground"
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffHours < 48) return 'Yesterday'
  return `${Math.floor(diffHours / 24)}d ago`
}

export default async function TrendingPage() {
  const { user, complaints, companies } = await getTrendingData()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Trending Now
            </h1>
            <p className="text-muted-foreground mt-1">
              The most discussed complaints and hottest topics right now
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Trending Complaints */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Hot Complaints
              </h2>
              
              {complaints.slice(0, 10).map((complaint: {
                id: string
                title: string
                content: string
                company_name?: string
                company?: { name: string; slug: string }
                category?: string | { name: string }
                state?: string | { name: string }
                city?: string
                severity: number
                upvotes?: number
                comment_count?: number
                view_count?: number
                created_at: string
              }, index: number) => (
                <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {/* Rank */}
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl font-bold ${index < 3 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                            #{index + 1}
                          </span>
                          <ArrowUp className={`h-4 w-4 ${index < 3 ? 'text-success' : 'text-muted-foreground'}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSeverityColor(complaint.severity)}>
                              Severity {complaint.severity}
                            </Badge>
                            {index < 3 && (
                              <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                                <Flame className="h-3 w-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                            {complaint.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {complaint.content}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {complaint.company_name || complaint.company?.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{complaint.upvotes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{complaint.comment_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimeAgo(complaint.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Most Complained Companies */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-destructive" />
                    Most Complained About
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companies.length > 0 ? (
                    companies.slice(0, 5).map((company: {
                      id: string
                      name: string
                      slug: string
                      complaint_count: number
                    }, index: number) => (
                      <Link
                        key={company.id}
                        href={`/companies/${company.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${index < 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            #{index + 1}
                          </span>
                          <span className="font-medium text-foreground line-clamp-1">
                            {company.name}
                          </span>
                        </div>
                        <Badge variant="secondary">{company.complaint_count}</Badge>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Trending Categories */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #SecurityDeposit
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #MaintenanceIssues
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #HOAAbuse
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #MoldProblems
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #PestInfestation
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #HiddenFees
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      #SafetyConcerns
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-primary text-primary-foreground border-0">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Have a complaint?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Share your experience and help protect other consumers.
                  </p>
                  <Link href="/submit">
                    <Button variant="secondary" className="w-full">
                      File a Complaint
                    </Button>
                  </Link>
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
