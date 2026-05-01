import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { Metadata } from "next"
import { 
  Search, 
  Building2, 
  FileText, 
  MapPin, 
  Star, 
  ThumbsUp,
  Clock
} from "lucide-react"

interface SearchParams {
  q?: string
  tab?: string
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams
  const query = params.q || ''
  
  return {
    title: query ? `Search results for "${query}"` : 'Search',
    description: query 
      ? `Find complaints, reviews, and businesses matching "${query}" on BadBizExposed.`
      : 'Search for companies, complaints, and reviews on BadBizExposed.',
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const query = params.q || ''
  const activeTab = params.tab || 'all'
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // Search companies
  const { data: companies } = query ? await supabase
    .from('companies')
    .select(`
      *,
      category:categories(name),
      state:states(abbreviation)
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('complaint_count', { ascending: false })
    .limit(20)
  : { data: [] }

  // Search complaints
  const { data: complaints } = query ? await supabase
    .from('complaints')
    .select(`
      *,
      company:companies(name, slug),
      user:profiles(display_name)
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20)
  : { data: [] }

  const totalResults = (companies?.length || 0) + (complaints?.length || 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-4">
              <Search className="h-8 w-8 text-primary" />
              Search
            </h1>
            
            <form action="/search" method="GET">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search companies, complaints, locations..."
                    defaultValue={query}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </form>

            {query && (
              <p className="mt-4 text-muted-foreground">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
              </p>
            )}
          </div>

          {query ? (
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="companies">
                  Companies ({companies?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="complaints">
                  Complaints ({complaints?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {companies && companies.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Companies
                    </h2>
                    {companies.slice(0, 5).map((company: {
                      id: string
                      name: string
                      slug: string
                      description: string | null
                      city: string | null
                      complaint_count: number
                      avg_rating: number
                      category?: { name: string }
                      state?: { abbreviation: string }
                    }) => (
                      <Link href={`/business/${company.slug}`} key={company.id}>
                        <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-foreground">{company.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  {company.city && company.state && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {company.city}, {company.state.abbreviation}
                                    </span>
                                  )}
                                  {company.category && (
                                    <Badge variant="outline" className="text-xs">{company.category.name}</Badge>
                                  )}
                                </div>
                                {company.description && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {company.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="font-medium">{company.avg_rating?.toFixed(1) || 'N/A'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{company.complaint_count} complaints</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {complaints && complaints.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Complaints
                    </h2>
                    {complaints.slice(0, 5).map((complaint: {
                      id: string
                      title: string
                      content: string
                      upvotes: number
                      created_at: string
                      company?: { name: string }
                      user?: { display_name: string }
                    }) => (
                      <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                        <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-foreground">{complaint.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {complaint.content}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{complaint.company?.name || 'Unknown Company'}</span>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {complaint.upvotes || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(complaint.created_at)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {totalResults === 0 && (
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No results found</h2>
                    <p className="text-muted-foreground">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="companies" className="space-y-4">
                {companies && companies.map((company: {
                  id: string
                  name: string
                  slug: string
                  description: string | null
                  city: string | null
                  complaint_count: number
                  avg_rating: number
                  category?: { name: string }
                  state?: { abbreviation: string }
                }) => (
                  <Link href={`/business/${company.slug}`} key={company.id}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{company.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              {company.city && company.state && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {company.city}, {company.state.abbreviation}
                                </span>
                              )}
                              {company.category && (
                                <Badge variant="outline" className="text-xs">{company.category.name}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{company.avg_rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{company.complaint_count} complaints</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>

              <TabsContent value="complaints" className="space-y-4">
                {complaints && complaints.map((complaint: {
                  id: string
                  title: string
                  content: string
                  upvotes: number
                  created_at: string
                  company?: { name: string }
                }) => (
                  <Link href={`/complaints/${complaint.id}`} key={complaint.id}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-foreground">{complaint.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {complaint.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{complaint.company?.name || 'Unknown Company'}</span>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {complaint.upvotes || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(complaint.created_at)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Start your search</h2>
              <p className="text-muted-foreground">
                Search for companies, complaints, or locations
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
