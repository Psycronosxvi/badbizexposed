import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { 
  Building2, 
  MapPin, 
  Star, 
  FileText, 
  ThumbsUp,
  MessageSquare,
  Eye,
  AlertTriangle,
  ExternalLink,
  Phone,
  Globe,
  Clock,
  TrendingUp,
  Bell
} from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: company } = await supabase
    .from('companies')
    .select('name, description, city, avg_rating, complaint_count')
    .eq('slug', slug)
    .single()

  if (!company) {
    return { title: 'Company Not Found' }
  }

  const title = `${company.name} Reviews & Complaints | BadBizExposed`
  const description = `Read ${company.complaint_count} complaints and reviews about ${company.name}${company.city ? ` in ${company.city}` : ''}. Average rating: ${company.avg_rating?.toFixed(1) || 'N/A'}/5. Report your experience.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  )
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
  return date.toLocaleDateString()
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select(`
      *,
      category:categories(*),
      state:states(*)
    `)
    .eq('slug', slug)
    .single()

  if (!company) {
    notFound()
  }

  // Get complaints for this company
  const { data: complaints } = await supabase
    .from('complaints')
    .select(`
      *,
      user:profiles(id, display_name, username, avatar_url),
      category:categories(name)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]
  complaints?.forEach(c => {
    if (c.severity >= 1 && c.severity <= 5) {
      ratingCounts[c.severity - 1]++
    }
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Company Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-8 w-8 text-accent" />
                  <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                  {company.is_verified && (
                    <Badge variant="secondary" className="bg-success/10 text-success">Verified</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {company.city && company.state && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {company.city}, {company.state.abbreviation}
                    </span>
                  )}
                  {company.category && (
                    <Badge variant="outline">{company.category.name}</Badge>
                  )}
                </div>
                {company.description && (
                  <p className="mt-4 text-muted-foreground max-w-2xl">{company.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/submit?company=${company.id}`}>
                  <Button variant="destructive" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    File Complaint
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Watch
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="pt-4 pb-4 text-center">
                    <FileText className="h-6 w-6 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold">{company.complaint_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Complaints</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{company.avg_rating?.toFixed(1) || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-4 pb-4 text-center">
                    <MessageSquare className="h-6 w-6 text-accent mx-auto mb-1" />
                    <p className="text-2xl font-bold">{company.discussion_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Discussions</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="pt-4 pb-4 text-center">
                    <Eye className="h-6 w-6 text-chart-4 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{(complaints?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </CardContent>
                </Card>
              </div>

              {/* Complaints List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recent Complaints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {complaints && complaints.length > 0 ? (
                    <div className="space-y-4">
                      {complaints.map((complaint: {
                        id: string
                        title: string
                        content: string
                        severity: number
                        status: string
                        upvotes: number
                        comment_count: number
                        created_at: string
                        is_anonymous: boolean
                        user?: { display_name: string }
                      }) => (
                        <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                          <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-foreground line-clamp-1">
                                {complaint.title}
                              </h3>
                              <StarRating rating={6 - complaint.severity} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {complaint.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {complaint.is_anonymous ? 'Anonymous' : complaint.user?.display_name || 'User'}
                              </span>
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
                      <p className="text-muted-foreground mb-4">No complaints yet</p>
                      <Link href={`/submit?company=${company.id}`}>
                        <Button variant="destructive">Be the First to Report</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Company Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {company.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{company.address}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Listed since {new Date(company.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingCounts[stars - 1]
                    const total = complaints?.length || 1
                    const percentage = (count / total) * 100
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm w-8">{stars} star</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{count}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Take Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/submit?company=${company.id}`}>
                    <Button variant="destructive" className="w-full gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      File a Complaint
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full gap-2">
                    <Bell className="h-4 w-4" />
                    Watch This Business
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": company.name,
            "description": company.description,
            "address": company.city && company.state ? {
              "@type": "PostalAddress",
              "addressLocality": company.city,
              "addressRegion": company.state.abbreviation,
            } : undefined,
            "telephone": company.phone,
            "url": company.website,
            "aggregateRating": company.avg_rating ? {
              "@type": "AggregateRating",
              "ratingValue": company.avg_rating,
              "bestRating": 5,
              "worstRating": 1,
              "reviewCount": company.complaint_count || 0,
            } : undefined,
          })
        }}
      />
    </div>
  )
}
