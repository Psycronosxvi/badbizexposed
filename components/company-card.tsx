"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  MapPin,
  AlertTriangle,
  MessageSquare,
  Star,
  ExternalLink,
  CheckCircle
} from "lucide-react"
import type { Company } from "@/lib/types"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`}>
      <Card className="bg-card border-border hover:border-primary/50 transition-all group h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 className="h-7 w-7 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {company.name}
                </h3>
                {company.is_verified && (
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                )}
              </div>

              {company.city && company.state && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3" />
                  {company.city}, {company.state.abbreviation}
                </p>
              )}

              {company.category && (
                <Badge variant="secondary" className="text-xs mb-3">
                  {company.category.name}
                </Badge>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-destructive font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  {company.complaint_count}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {company.discussion_count}
                </span>
                {company.avg_rating > 0 && (
                  <span className="flex items-center gap-1 text-chart-4">
                    <Star className="h-4 w-4" />
                    {company.avg_rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>

          {company.description && (
            <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
              {company.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
