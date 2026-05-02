"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, AlertTriangle, MessageSquare, MapPin } from "lucide-react"
import type { Company } from "@/lib/types"

interface TopCompaniesProps {
  companies: Company[]
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Pinnacle Property Management',
    slug: 'pinnacle-property-management',
    description: null,
    logo_url: null,
    website: null,
    category_id: null,
    state_id: null,
    city: 'Denver',
    address: null,
    phone: null,
    complaint_count: 89,
    discussion_count: 23,
    avg_rating: 1.8,
    is_verified: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    state: { id: '1', name: 'Colorado', abbreviation: 'CO', complaint_count: 0, created_at: '' },
  },
  {
    id: '2',
    name: 'Desert Vista HOA',
    slug: 'desert-vista-hoa',
    description: null,
    logo_url: null,
    website: null,
    category_id: null,
    state_id: null,
    city: 'Phoenix',
    address: null,
    phone: null,
    complaint_count: 67,
    discussion_count: 18,
    avg_rating: 2.1,
    is_verified: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    state: { id: '2', name: 'Arizona', abbreviation: 'AZ', complaint_count: 0, created_at: '' },
  },
  {
    id: '3',
    name: 'Sunset Rentals LLC',
    slug: 'sunset-rentals-llc',
    description: null,
    logo_url: null,
    website: null,
    category_id: null,
    state_id: null,
    city: 'Austin',
    address: null,
    phone: null,
    complaint_count: 54,
    discussion_count: 12,
    avg_rating: 2.3,
    is_verified: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    state: { id: '3', name: 'Texas', abbreviation: 'TX', complaint_count: 0, created_at: '' },
  },
  {
    id: '4',
    name: 'Evergreen Management Co',
    slug: 'evergreen-management-co',
    description: null,
    logo_url: null,
    website: null,
    category_id: null,
    state_id: null,
    city: 'Seattle',
    address: null,
    phone: null,
    complaint_count: 45,
    discussion_count: 9,
    avg_rating: 2.5,
    is_verified: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    state: { id: '4', name: 'Washington', abbreviation: 'WA', complaint_count: 0, created_at: '' },
  },
]

export function TopCompanies({ companies }: TopCompaniesProps) {
  const displayCompanies = companies.length > 0 ? companies : mockCompanies

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Most Reported Companies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayCompanies.slice(0, 5).map((company, index) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-destructive/50 hover:bg-secondary/30 transition-all group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {company.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {company.city && company.state && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {company.city}, {company.state.abbreviation}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                {company.complaint_count} complaints
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 justify-end">
                <MessageSquare className="h-3 w-3" />
                {company.discussion_count} discussions
              </div>
            </div>
          </Link>
        ))}

        <Link
          href="/companies"
          className="block text-center text-sm text-primary hover:underline pt-2"
        >
          View all companies
        </Link>
      </CardContent>
    </Card>
  )
}
