"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Star, 
  AlertTriangle,
  MessageSquare,
  ExternalLink,
  MapPin
} from "lucide-react"
import type { Company } from "@/lib/types"

interface FeaturedCompaniesProps {
  companies: Company[]
  title?: string
}

export function FeaturedCompanies({ companies, title = "Companies Under Review" }: FeaturedCompaniesProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="block group"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-secondary/30 transition-all">
              {/* Company logo or placeholder */}
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt={company.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Company info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground group-hover:text-accent transition-colors truncate">
                    {company.name}
                  </h3>
                  {company.is_verified && (
                    <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                      Verified
                    </Badge>
                  )}
                </div>

                {company.city && company.state && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {company.city}, {company.state.abbreviation}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    {company.complaint_count} complaints
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {company.discussion_count} discussions
                  </span>
                  {company.avg_rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-chart-4" />
                      {company.avg_rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
            </div>
          </Link>
        ))}

        {companies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No companies listed yet.</p>
          </div>
        )}

        <Link
          href="/companies"
          className="block text-center text-sm text-accent hover:underline pt-2"
        >
          Browse all companies
        </Link>
      </CardContent>
    </Card>
  )
}
