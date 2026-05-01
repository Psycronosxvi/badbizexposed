"use client"

import { Header } from "@/components/header"
import { useAuth } from "@/components/providers/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function HeaderWrapper() {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  const headerUser = user && profile ? {
    id: user.id,
    email: user.email,
    display_name: profile.display_name || profile.full_name || user.email?.split('@')[0],
    is_admin: profile.is_admin,
  } : null

  return <Header user={headerUser} />
}
