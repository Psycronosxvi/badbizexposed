import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Home, FileText, Building2, Map, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Find Complaints - BadBizExposed",
  description: "Search for complaints about businesses, contractors, landlords, and more.",
}

const popularSearches = [
  "Oak Tree Apartments",
  "Plantation Apartments",
  "Property Management",
  "Contractor Non-Payment",
  "HOA Disputes",
  "Moving Company Scams"
]

const quickLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/submit", label: "Submit Complaint", icon: FileText },
  { href: "/companies", label: "Browse Companies", icon: Building2 },
  { href: "/categories", label: "All Categories", icon: Map },
]

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16">
          {/* Search Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Find Complaints
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Looking for something specific? Search our database of complaints, companies, and reviews.
            </p>
            
            {/* Search Form */}
            <form action="/search" method="GET" className="max-w-xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search companies, complaints, locations..."
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Popular Searches */}
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((search) => (
                <Link key={search} href={`/search?q=${encodeURIComponent(search)}`}>
                  <Button variant="outline" size="sm">
                    {search}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.label}
                        </h3>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-12">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/submit" className="text-primary hover:underline">
              Submit a new complaint
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
