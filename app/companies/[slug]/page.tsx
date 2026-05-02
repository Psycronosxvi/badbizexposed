import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { CompanyHeader } from "@/components/company-header"
import { CompanyComplaints } from "@/components/company-complaints"
import { CompanyDiscussions } from "@/components/company-discussions"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText, MessageSquare, Plus } from "lucide-react"
import type { Company, Complaint, Discussion } from "@/lib/types"

// Mock data for demo
const mockCompany: Company = {
  id: '1',
  name: 'Pinnacle Property Management',
  slug: 'pinnacle-property-management',
  description: 'Pinnacle Property Management is a large property management company operating across the Southwest United States. They manage residential properties including apartments, condos, and single-family homes. Despite their size, they have received numerous complaints regarding maintenance delays, poor communication, and questionable billing practices.',
  logo_url: null,
  website: 'https://pinnacle-pm.example.com',
  category_id: '1',
  state_id: '1',
  city: 'Los Angeles',
  address: '123 Main Street, Suite 400',
  phone: '(555) 123-4567',
  complaint_count: 234,
  discussion_count: 45,
  avg_rating: 1.2,
  is_verified: false,
  is_featured: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
  state: { id: '1', name: 'California', abbreviation: 'CA', complaint_count: 500, created_at: '' },
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Mold issue ignored for 6 months',
    content: 'Reported black mold in the bathroom multiple times. Property management refused to address the issue despite health concerns. Had to involve the health department.',
    company_id: '1',
    user_id: '1',
    category_id: '1',
    state_id: '1',
    city: 'Los Angeles',
    severity: 5,
    status: 'investigating',
    upvotes: 89,
    downvotes: 2,
    comment_count: 34,
    view_count: 1203,
    is_anonymous: false,
    is_featured: true,
    is_verified: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: '1', username: 'tenant_advocate', display_name: 'Sarah M.', avatar_url: null, bio: null, reputation: 450, is_admin: false, is_bot: false, created_at: '', updated_at: '' },
  },
  {
    id: '2',
    title: 'Unauthorized entry into apartment',
    content: 'Property manager entered my apartment without proper 24-hour notice THREE times this month. This is a clear violation of tenant rights.',
    company_id: '1',
    user_id: '2',
    category_id: '1',
    state_id: '1',
    city: 'San Diego',
    severity: 4,
    status: 'open',
    upvotes: 67,
    downvotes: 3,
    comment_count: 21,
    view_count: 856,
    is_anonymous: true,
    is_featured: false,
    is_verified: false,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Security deposit theft - $2,400',
    content: 'Moved out after lease ended, left apartment spotless with photo documentation. Pinnacle kept my entire $2,400 deposit claiming "damages" that did not exist.',
    company_id: '1',
    user_id: '3',
    category_id: '1',
    state_id: '1',
    city: 'Los Angeles',
    severity: 5,
    status: 'resolved',
    upvotes: 124,
    downvotes: 5,
    comment_count: 56,
    view_count: 2341,
    is_anonymous: false,
    is_featured: true,
    is_verified: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: '3', username: 'former_tenant_123', display_name: 'Mike R.', avatar_url: null, bio: null, reputation: 120, is_admin: false, is_bot: false, created_at: '', updated_at: '' },
  },
]

const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Anyone else dealing with Pinnacle in LA area?',
    content: 'Looking to connect with other tenants dealing with Pinnacle Property Management issues in the Los Angeles area. Considering organizing a tenant union.',
    company_id: '1',
    user_id: '1',
    upvotes: 45,
    downvotes: 1,
    comment_count: 23,
    view_count: 567,
    is_pinned: true,
    is_locked: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: '1', username: 'tenant_advocate', display_name: 'Sarah M.', avatar_url: null, bio: null, reputation: 450, is_admin: false, is_bot: false, created_at: '', updated_at: '' },
  },
  {
    id: '2',
    title: 'Tips for documenting maintenance requests',
    content: 'Sharing my experience with documentation that helped me win a dispute. Always get everything in writing!',
    company_id: '1',
    user_id: '4',
    upvotes: 78,
    downvotes: 0,
    comment_count: 31,
    view_count: 892,
    is_pinned: false,
    is_locked: false,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: '4', username: 'legal_eagle', display_name: 'James L.', avatar_url: null, bio: null, reputation: 890, is_admin: false, is_bot: false, created_at: '', updated_at: '' },
  },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // Fetch company
  const { data: company } = await supabase
    .from('companies')
    .select(`
      *,
      category:categories(*),
      state:states(*)
    `)
    .eq('slug', slug)
    .single()

  // Fetch complaints for this company
  const { data: complaints } = await supabase
    .from('complaints')
    .select(`
      *,
      user:profiles(id, username, display_name, avatar_url, reputation),
      category:categories(*)
    `)
    .eq('company_id', company?.id)
    .order('upvotes', { ascending: false })
    .limit(20)

  // Fetch discussions for this company
  const { data: discussions } = await supabase
    .from('discussions')
    .select(`
      *,
      user:profiles(id, username, display_name, avatar_url, reputation)
    `)
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Use mock data if database is empty
  const displayCompany = company || mockCompany
  const displayComplaints = complaints?.length ? complaints : mockComplaints
  const displayDiscussions = discussions?.length ? discussions : mockDiscussions

  if (!company && slug !== 'pinnacle-property-management') {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />

      <main className="flex-1">
        {/* Company Header */}
        <CompanyHeader company={displayCompany} />

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Tabs defaultValue="complaints" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="complaints" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Complaints ({displayCompany.complaint_count})
                </TabsTrigger>
                <TabsTrigger value="discussions" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Discussions ({displayCompany.discussion_count})
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Link href={`/submit?company=${displayCompany.slug}`}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    File Complaint
                  </Button>
                </Link>
                <Link href={`/companies/${displayCompany.slug}/discuss`}>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Start Discussion
                  </Button>
                </Link>
              </div>
            </div>

            <TabsContent value="complaints">
              <CompanyComplaints complaints={displayComplaints} />
            </TabsContent>

            <TabsContent value="discussions">
              <CompanyDiscussions discussions={displayDiscussions} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
