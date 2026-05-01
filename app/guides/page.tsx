import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  FileText, 
  Home, 
  Car, 
  CreditCard, 
  ShoppingBag, 
  Briefcase,
  Scale,
  Phone,
  ArrowRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "Consumer Guides | BadBiz Exposed",
  description: "Comprehensive guides to help consumers understand their rights and navigate common issues.",
}

const guides = [
  {
    icon: Home,
    title: "Tenant Rights Guide",
    description: "Everything you need to know about your rights as a renter, from security deposits to eviction protections.",
    category: "Housing",
    href: "/blog/understanding-landlord-tenant-rights"
  },
  {
    icon: Car,
    title: "Auto Repair & Dealership Rights",
    description: "Learn how to protect yourself from auto repair scams and understand dealership practices.",
    category: "Automotive",
    href: "/blog"
  },
  {
    icon: CreditCard,
    title: "Credit & Debt Collection",
    description: "Know your rights when dealing with debt collectors and credit reporting agencies.",
    category: "Financial",
    href: "/blog"
  },
  {
    icon: ShoppingBag,
    title: "Online Shopping Protection",
    description: "Tips for safe online shopping and what to do when things go wrong with e-commerce purchases.",
    category: "E-Commerce",
    href: "/blog/common-scams-to-avoid"
  },
  {
    icon: Briefcase,
    title: "Contractor & Home Services",
    description: "How to vet contractors, protect yourself from fraud, and handle disputes with service providers.",
    category: "Services",
    href: "/blog"
  },
  {
    icon: Scale,
    title: "Small Claims Court Guide",
    description: "Step-by-step guide to filing and winning a small claims court case against a business.",
    category: "Legal",
    href: "/blog"
  },
  {
    icon: Phone,
    title: "Telecom & Utility Rights",
    description: "Understand your rights with phone, internet, and utility companies.",
    category: "Utilities",
    href: "/blog"
  },
  {
    icon: FileText,
    title: "Filing Effective Complaints",
    description: "Learn how to document issues and file complaints that get results.",
    category: "General",
    href: "/blog/how-to-file-effective-complaint"
  }
]

const resources = [
  {
    title: "Federal Trade Commission (FTC)",
    description: "File complaints about deceptive business practices",
    url: "https://www.ftc.gov/complaint"
  },
  {
    title: "Consumer Financial Protection Bureau",
    description: "Financial product and service complaints",
    url: "https://www.consumerfinance.gov/complaint/"
  },
  {
    title: "Better Business Bureau",
    description: "Business accreditation and dispute resolution",
    url: "https://www.bbb.org/"
  },
  {
    title: "State Attorney General",
    description: "Consumer protection at the state level",
    url: "https://www.usa.gov/state-attorney-general"
  }
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Consumer Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive resources to help you understand your rights and navigate disputes with businesses.
            </p>
          </div>

          {/* Guides Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {guides.map((guide) => (
              <Link key={guide.title} href={guide.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <guide.icon className="h-10 w-10 text-primary" />
                      <Badge variant="secondary">{guide.category}</Badge>
                    </div>
                    <CardTitle className="mt-4">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-primary text-sm font-medium inline-flex items-center">
                      Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* External Resources */}
          <section>
            <h2 className="text-2xl font-bold mb-6">External Resources</h2>
            <p className="text-muted-foreground mb-6">
              These government and nonprofit organizations can also help with consumer complaints:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <a 
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
