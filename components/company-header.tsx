"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  AlertTriangle,
  MessageSquare,
  Star,
  Globe,
  Phone,
  CheckCircle,
  Share2,
  Flag
} from "lucide-react"
import type { Company } from "@/lib/types"

interface CompanyHeaderProps {
  company: Company
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const getRatingColor = (rating: number) => {
    if (rating <= 1.5) return "text-destructive"
    if (rating <= 2.5) return "text-warning"
    return "text-success"
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo */}
          <div className="w-24 h-24 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Building2 className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
              {company.is_verified && (
                <Badge variant="secondary" className="bg-accent/20 text-accent gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {company.category && (
                <Badge variant="secondary">
                  {company.category.name}
                </Badge>
              )}
            </div>

            {company.city && company.state && (
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                {company.address ? `${company.address}, ` : ''}{company.city}, {company.state.name}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-2xl font-bold text-destructive">{company.complaint_count}</span>
                <span className="text-muted-foreground">complaints</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold text-accent">{company.discussion_count}</span>
                <span className="text-muted-foreground">discussions</span>
              </div>
              {company.avg_rating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className={`h-5 w-5 ${getRatingColor(company.avg_rating)}`} />
                  <span className={`text-2xl font-bold ${getRatingColor(company.avg_rating)}`}>
                    {company.avg_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/ 5 rating</span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {company.phone}
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>
        </div>

        {company.description && (
          <p className="mt-6 text-muted-foreground max-w-3xl">
            {company.description}
          </p>
        )}
      </div>
    </div>
  )
}
