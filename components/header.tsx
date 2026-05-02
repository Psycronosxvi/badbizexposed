"use client"

import Link from "next/link"
import { useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { DonateButton } from "@/components/donate-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Shield,
  FileText,
  Building2,
  Map,
  TrendingUp,
  Plus,
  AlertTriangle
} from "lucide-react"

interface HeaderProps {
  user?: {
    id: string
    email?: string
    display_name?: string
    is_admin?: boolean
  } | null
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navItems = [
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/complaints", label: "Complaints", icon: FileText },
    { href: "/map", label: "Map", icon: Map },
    { href: "/trending", label: "Trending", icon: TrendingUp },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <BrandLogo size="md" animated={false} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <form action="/search" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search companies, complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <DonateButton variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary" />
            {user ? (
              <>
                <Link href="/submit">
                  <Button size="sm" variant="destructive" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">File Complaint</span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.display_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.is_admin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2 text-primary">
                            <Shield className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action="/auth/signout" method="POST" className="w-full">
                        <button type="submit" className="flex items-center gap-2 w-full text-destructive">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <form action="/search" method="GET" className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search..."
                className="pl-10 bg-secondary"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <DonateButton variant="outline" size="sm" className="w-full justify-center" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
