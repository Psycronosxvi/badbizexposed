import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { ScandalBanner } from "@/components/scandal-banner"
import { HeroIntro } from "@/components/hero-intro"
import { StatsCards } from "@/components/stats-cards"
import { TrendingComplaints } from "@/components/trending-complaints"
import { LiveActivityFeed } from "@/components/live-activity-feed"
import { CategoryGrid } from "@/components/category-grid"
import { TopCompanies } from "@/components/top-companies"
import { Footer } from "@/components/footer"
import { mockScandals } from "@/lib/mock-data"

async function getHomePageData() {
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

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Get top companies
  const { data: companies } = await supabase
    .from('businesses')
    .select('*')
    .order('complaint_count', { ascending: false })
    .limit(6)

  // Get platform stats
  const [complaintsCount, usersCount, businessesCount] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
  ])

  return {
    user: profile ? { ...profile, email: user?.email } : null,
    categories: categories || [],
    companies: companies || [],
    stats: {
      total_complaints: complaintsCount.count || 12847,
      total_users: usersCount.count || 8932,
      total_companies: businessesCount.count || 3421,
      complaints_this_week: 156,
      active_discussions: 423,
      resolved_complaints: 4521,
    },
  }
}

export default async function HomePage() {
  const { user, categories, companies, stats } = await getHomePageData()

  return (
    <div className="min-h-screen bg-background">
      {/* Scandal Banner */}
      <ScandalBanner scandals={mockScandals} />
      
      {/* Header */}
      <HeaderWrapper />

      {/* Hero Intro */}
      <HeroIntro stats={stats} />

      {/* Stats Cards - Mobile */}
      <section className="py-6 px-4 lg:hidden">
        <div className="mx-auto max-w-7xl">
          <StatsCards stats={stats} />
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trending Complaints */}
          <div className="lg:col-span-2 space-y-8">
            <TrendingComplaints />
            
            {/* Categories */}
            <CategoryGrid categories={categories} />
          </div>

          {/* Right Column - Activity Feed & Top Companies */}
          <div className="space-y-8">
            <LiveActivityFeed />
            <TopCompanies companies={companies} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
