import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { CompanyCard } from "@/components/company-card"
import { CompanyFilters } from "@/components/company-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Building2, Plus } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { Company, Category, State } from "@/lib/types"

export const metadata: Metadata = {
  title: 'Company Directory - Find Landlord & Property Manager Reviews',
  description: 'Search our database of property management companies, landlords, HOAs, and contractors. Read reviews, complaints, and ratings. Find Oak Tree Apartments, Plantation Apartments, Maddox Properties, and more.',
  keywords: [
    'property management reviews',
    'landlord complaints',
    'HOA reviews',
    'apartment reviews Mobile Alabama',
    'Oak Tree Apartments reviews',
    'Plantation Apartments complaints',
    'Maddox Properties LLC reviews',
    'bad landlord database',
    'tenant complaint directory',
  ],
  openGraph: {
    title: 'Company Directory - BadBizExposed',
    description: 'Browse reviews and complaints about property managers, landlords, and HOAs.',
  },
}

interface SearchParams {
  q?: string
  category?: string
  state?: string
  sort?: string
  page?: string
}

// Mock companies for demo
const mockCompanies: Company[] = [
  // Mobile, Alabama Properties - Priority Tracking
  {
    id: '7',
    name: 'Oak Tree Apartments',
    slug: 'oak-tree-apartments-mobile',
    description: 'Apartment complex in Mobile, Alabama with reported maintenance and pest issues. Multiple complaints about roaches, mold, and safety concerns.',
    logo_url: null,
    website: null,
    category_id: '1',
    state_id: '7',
    city: 'Mobile',
    address: null,
    phone: null,
    complaint_count: 156,
    discussion_count: 34,
    avg_rating: 1.4,
    is_verified: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
    state: { id: '7', name: 'Alabama', abbreviation: 'AL', complaint_count: 200, created_at: '' },
  },
  {
    id: '8',
    name: 'Plantation Apartments',
    slug: 'plantation-apartments-mobile',
    description: 'Rental property in Mobile, Alabama under negative review monitoring. Reports of billing issues and staff behavior problems.',
    logo_url: null,
    website: null,
    category_id: '1',
    state_id: '7',
    city: 'Mobile',
    address: null,
    phone: null,
    complaint_count: 189,
    discussion_count: 42,
    avg_rating: 1.2,
    is_verified: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
    state: { id: '7', name: 'Alabama', abbreviation: 'AL', complaint_count: 200, created_at: '' },
  },
  {
    id: '9',
    name: 'Maddox Properties LLC',
    slug: 'maddox-properties-llc',
    description: 'Property management and ownership company operating in Mobile, Alabama area. Pattern of security deposit retention and maintenance neglect.',
    logo_url: null,
    website: null,
    category_id: '1',
    state_id: '7',
    city: 'Mobile',
    address: null,
    phone: null,
    complaint_count: 234,
    discussion_count: 67,
    avg_rating: 1.1,
    is_verified: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
    state: { id: '7', name: 'Alabama', abbreviation: 'AL', complaint_count: 200, created_at: '' },
  },
  // Original Companies
  {
    id: '1',
    name: 'Pinnacle Property Management',
    slug: 'pinnacle-property-management',
    description: 'Property management company operating across the Southwest.',
    logo_url: null,
    website: 'https://example.com',
    category_id: '1',
    state_id: '1',
    city: 'Los Angeles',
    address: '123 Main St',
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
  },
  {
    id: '2',
    name: 'Desert Vista HOA',
    slug: 'desert-vista-hoa',
    description: 'Homeowners Association serving the Desert Vista community.',
    logo_url: null,
    website: null,
    category_id: '3',
    state_id: '2',
    city: 'Phoenix',
    address: null,
    phone: null,
    complaint_count: 187,
    discussion_count: 67,
    avg_rating: 1.5,
    is_verified: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '3', name: 'HOA', slug: 'hoa', description: null, icon: 'users', created_at: '' },
    state: { id: '2', name: 'Arizona', abbreviation: 'AZ', complaint_count: 300, created_at: '' },
  },
  {
    id: '3',
    name: 'Midwest Rental Properties',
    slug: 'midwest-rental-properties',
    description: 'Large rental property management serving the Midwest region.',
    logo_url: null,
    website: null,
    category_id: '2',
    state_id: '3',
    city: 'Chicago',
    address: null,
    phone: null,
    complaint_count: 156,
    discussion_count: 34,
    avg_rating: 1.8,
    is_verified: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '2', name: 'Landlords', slug: 'landlords', description: null, icon: 'home', created_at: '' },
    state: { id: '3', name: 'Illinois', abbreviation: 'IL', complaint_count: 200, created_at: '' },
  },
  {
    id: '4',
    name: 'QuickMove LLC',
    slug: 'quickmove-llc',
    description: 'Interstate moving company with nationwide operations.',
    logo_url: null,
    website: null,
    category_id: '6',
    state_id: '4',
    city: 'Houston',
    address: null,
    phone: null,
    complaint_count: 312,
    discussion_count: 89,
    avg_rating: 1.1,
    is_verified: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '6', name: 'Moving Companies', slug: 'moving-companies', description: null, icon: 'truck', created_at: '' },
    state: { id: '4', name: 'Texas', abbreviation: 'TX', complaint_count: 450, created_at: '' },
  },
  {
    id: '5',
    name: 'Premier Home Renovations',
    slug: 'premier-home-renovations',
    description: 'Home renovation and remodeling contractor.',
    logo_url: null,
    website: null,
    category_id: '5',
    state_id: '5',
    city: 'Miami',
    address: null,
    phone: null,
    complaint_count: 145,
    discussion_count: 32,
    avg_rating: 1.4,
    is_verified: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '5', name: 'Contractors', slug: 'contractors', description: null, icon: 'hammer', created_at: '' },
    state: { id: '5', name: 'Florida', abbreviation: 'FL', complaint_count: 380, created_at: '' },
  },
  {
    id: '6',
    name: 'Lakeside Property Group',
    slug: 'lakeside-property-group',
    description: 'Property management for lakefront communities.',
    logo_url: null,
    website: null,
    category_id: '1',
    state_id: '6',
    city: 'Seattle',
    address: null,
    phone: null,
    complaint_count: 98,
    discussion_count: 21,
    avg_rating: 2.1,
    is_verified: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
    state: { id: '6', name: 'Washington', abbreviation: 'WA', complaint_count: 150, created_at: '' },
  },
]

const mockCategories: Category[] = [
  { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
  { id: '2', name: 'Landlords', slug: 'landlords', description: null, icon: 'home', created_at: '' },
  { id: '3', name: 'HOA', slug: 'hoa', description: null, icon: 'users', created_at: '' },
  { id: '5', name: 'Contractors', slug: 'contractors', description: null, icon: 'hammer', created_at: '' },
  { id: '6', name: 'Moving Companies', slug: 'moving-companies', description: null, icon: 'truck', created_at: '' },
]

const mockStates: State[] = [
  { id: '7', name: 'Alabama', abbreviation: 'AL', complaint_count: 200, created_at: '' },
  { id: '2', name: 'Arizona', abbreviation: 'AZ', complaint_count: 300, created_at: '' },
  { id: '1', name: 'California', abbreviation: 'CA', complaint_count: 500, created_at: '' },
  { id: '5', name: 'Florida', abbreviation: 'FL', complaint_count: 380, created_at: '' },
  { id: '3', name: 'Illinois', abbreviation: 'IL', complaint_count: 200, created_at: '' },
  { id: '4', name: 'Texas', abbreviation: 'TX', complaint_count: 450, created_at: '' },
]

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // Fetch companies with filters
  let query = supabase
    .from('companies')
    .select(`
      *,
      category:categories(*),
      state:states(*)
    `)

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }
  if (params.category) {
    query = query.eq('categories.slug', params.category)
  }
  if (params.state) {
    query = query.eq('states.abbreviation', params.state)
  }

  // Sort
  switch (params.sort) {
    case 'complaints':
      query = query.order('complaint_count', { ascending: false })
      break
    case 'rating':
      query = query.order('avg_rating', { ascending: true })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('complaint_count', { ascending: false })
  }

  const { data: companies } = await query.limit(50)
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  const { data: states } = await supabase.from('states').select('*').order('name')

  const displayCompanies = companies?.length ? companies : mockCompanies
  const displayCategories = categories?.length ? categories : mockCategories
  const displayStates = states?.length ? states : mockStates

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Building2 className="h-8 w-8 text-accent" />
                Company Directory
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and search companies with consumer complaints
              </p>
            </div>
            <Link href="/companies/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <form action="/companies" method="GET" className="flex gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="q"
                  placeholder="Search companies..."
                  defaultValue={params.q}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <CompanyFilters
              categories={displayCategories}
              states={displayStates}
              currentCategory={params.category}
              currentState={params.state}
              currentSort={params.sort}
            />
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          {displayCompanies.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No companies found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Link href="/companies/add">
                <Button>Add a Company</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
