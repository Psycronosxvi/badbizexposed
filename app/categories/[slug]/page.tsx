import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { ComplaintCard } from "@/components/complaint-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  Building2, Home, Users, Map, Hammer, Truck, AlertCircle, 
  Zap, Droplet, ShieldAlert, Store, Globe, FileText, Plus,
  ArrowLeft, Filter
} from "lucide-react"
import { mockComplaints } from "@/lib/mock-data"

// Category definitions with icons and descriptions
const categoryData: Record<string, { 
  name: string
  description: string
  icon: any
  color: string
}> = {
  "property-management": {
    name: "Property Management",
    description: "Complaints about apartment complexes, property managers, and rental management companies",
    icon: Building2,
    color: "text-blue-500"
  },
  "landlords": {
    name: "Landlords",
    description: "Issues with individual landlords and rental property owners",
    icon: Home,
    color: "text-green-500"
  },
  "hoa": {
    name: "HOA",
    description: "Homeowner association disputes, fees, and rule enforcement issues",
    icon: Users,
    color: "text-purple-500"
  },
  "real-estate": {
    name: "Real Estate",
    description: "Problems with real estate agents, brokers, and property transactions",
    icon: Map,
    color: "text-cyan-500"
  },
  "contractors": {
    name: "Contractors",
    description: "General contractors, subcontractors, and construction-related complaints",
    icon: Hammer,
    color: "text-orange-500"
  },
  "moving-companies": {
    name: "Moving Companies",
    description: "Moving and relocation service complaints including damage and pricing issues",
    icon: Truck,
    color: "text-indigo-500"
  },
  "non-payment": {
    name: "Non-Payment",
    description: "Businesses refusing to pay contractors, vendors, or service providers",
    icon: AlertCircle,
    color: "text-red-500"
  },
  "electrical-issues": {
    name: "Electrical Issues",
    description: "Electrical hazards, code violations, and electrician-related complaints",
    icon: Zap,
    color: "text-yellow-500"
  },
  "plumbing-issues": {
    name: "Plumbing Issues",
    description: "Plumbing failures, water damage, and plumber-related complaints",
    icon: Droplet,
    color: "text-sky-500"
  },
  "safety-hazards": {
    name: "Safety Hazards",
    description: "Fire safety violations, structural issues, mold, and other safety concerns",
    icon: ShieldAlert,
    color: "text-rose-500"
  },
  "online-businesses": {
    name: "Online Businesses",
    description: "E-commerce scams, online service complaints, and digital business issues",
    icon: Globe,
    color: "text-violet-500"
  },
  "mom-and-pop-businesses": {
    name: "Mom & Pop Businesses",
    description: "Local small business complaints and neighborhood store issues",
    icon: Store,
    color: "text-amber-500"
  }
}

// Get all valid category slugs for static generation
export function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = categoryData[slug]
  
  if (!category) {
    return {
      title: "Category Not Found - BadBizExposed",
      description: "This category does not exist."
    }
  }

  return {
    title: `${category.name} Complaints - BadBizExposed`,
    description: category.description,
    openGraph: {
      title: `${category.name} Complaints - BadBizExposed`,
      description: category.description,
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categoryData[slug]
  
  // Filter complaints by category (case-insensitive match)
  const categoryComplaints = mockComplaints.filter(c => 
    c.category?.toLowerCase().replace(/\s+/g, '-') === slug ||
    c.category?.toLowerCase() === category?.name?.toLowerCase()
  )

  // If category doesn't exist, show a helpful page instead of 404
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <HeaderWrapper />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn&apos;t find the category you&apos;re looking for. Try browsing our available categories below.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {Object.entries(categoryData).slice(0, 6).map(([catSlug, cat]) => {
                const Icon = cat.icon
                return (
                  <Link key={catSlug} href={`/categories/${catSlug}`}>
                    <Button variant="outline" className="gap-2">
                      <Icon className={`h-4 w-4 ${cat.color}`} />
                      {cat.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
            <Link href="/search">
              <Button size="lg">Search All Complaints</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const Icon = category.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        {/* Category Header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </Link>
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-xl bg-background border border-border ${category.color}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
                <p className="text-muted-foreground max-w-2xl">{category.description}</p>
              </div>
              <Link href="/submit">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Complaint
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Complaints List */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          {categoryComplaints.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {categoryComplaints.length} complaint{categoryComplaints.length !== 1 ? 's' : ''} found
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <div className="grid gap-4">
                {categoryComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Icon className={`h-16 w-16 mx-auto mb-6 ${category.color} opacity-50`} />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No complaints found yet
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Be the first to report an issue in the {category.name} category. Your complaint helps protect others.
                </p>
                <Link href="/submit">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Submit the First Complaint
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Related Categories */}
        <section className="border-t border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Browse Other Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(categoryData)
                .filter(([catSlug]) => catSlug !== slug)
                .slice(0, 6)
                .map(([catSlug, cat]) => {
                  const CatIcon = cat.icon
                  return (
                    <Link key={catSlug} href={`/categories/${catSlug}`}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                          <CatIcon className={`h-6 w-6 mx-auto mb-2 ${cat.color}`} />
                          <p className="text-sm font-medium text-foreground">{cat.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
