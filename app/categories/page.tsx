import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  Building2, Home, Users, Map, Hammer, Truck, AlertCircle, 
  Zap, Droplet, ShieldAlert, Store, Globe, ArrowRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "Browse Categories - BadBizExposed",
  description: "Browse complaint categories including property management, contractors, landlords, HOA, and more.",
}

const categories = [
  {
    slug: "property-management",
    name: "Property Management",
    description: "Apartment complexes and property managers",
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    count: 8934
  },
  {
    slug: "landlords",
    name: "Landlords",
    description: "Individual landlords and rental owners",
    icon: Home,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    count: 3421
  },
  {
    slug: "hoa",
    name: "HOA",
    description: "Homeowner associations",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    count: 2156
  },
  {
    slug: "contractors",
    name: "Contractors",
    description: "General contractors, electricians, plumbers",
    icon: Hammer,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    count: 4532
  },
  {
    slug: "non-payment",
    name: "Non-Payment",
    description: "Businesses refusing to pay for services",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    count: 5678
  },
  {
    slug: "moving-companies",
    name: "Moving Companies",
    description: "Moving and relocation services",
    icon: Truck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    count: 2341
  },
  {
    slug: "electrical-issues",
    name: "Electrical Issues",
    description: "Electrical hazards and code violations",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    count: 1234
  },
  {
    slug: "plumbing-issues",
    name: "Plumbing Issues",
    description: "Plumbing failures and water damage",
    icon: Droplet,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    count: 1567
  },
  {
    slug: "safety-hazards",
    name: "Safety Hazards",
    description: "Fire safety, structural issues, mold",
    icon: ShieldAlert,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    count: 2890
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    description: "Real estate agents and brokers",
    icon: Map,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    count: 1876
  },
  {
    slug: "online-businesses",
    name: "Online Businesses",
    description: "E-commerce and digital services",
    icon: Globe,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    count: 3245
  },
  {
    slug: "mom-and-pop-businesses",
    name: "Mom & Pop Businesses",
    description: "Local small business complaints",
    icon: Store,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    count: 1123
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Browse Categories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Find complaints by category. Select a category below to see all related complaints and reports.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.slug} href={`/categories/${category.slug}`}>
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${category.bgColor}`}>
                          <Icon className={`h-6 w-6 ${category.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {category.name}
                            </h2>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {category.count.toLocaleString()} complaints
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
