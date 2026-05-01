"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Scandal {
  id: string
  title: string
  summary: string
  company_name?: string
  severity: number
  source_url?: string
  created_at: string
}

interface ScandalBannerProps {
  scandals: Scandal[]
}

export function ScandalBanner({ scandals }: ScandalBannerProps) {
  if (!scandals || scandals.length === 0) return null

  return (
    <div className="bg-destructive text-destructive-foreground overflow-hidden">
      <div className="relative flex items-center h-10">
        <div className="absolute left-0 z-10 flex items-center gap-2 px-4 bg-destructive font-bold text-sm">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span>BREAKING</span>
        </div>
        <div className="flex animate-marquee whitespace-nowrap pl-32">
          {[...scandals, ...scandals].map((scandal, idx) => (
            <Link
              key={`${scandal.id}-${idx}`}
              href={scandal.source_url || "#"}
              className="mx-8 flex items-center gap-2 hover:underline"
            >
              <span className="font-medium">{scandal.title}</span>
              <span className="text-destructive-foreground/80">—</span>
              <span className="text-destructive-foreground/80">{scandal.summary}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
