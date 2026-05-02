"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Users, 
  Bot,
  MessageSquare,
  Flag,
  Settings,
  BarChart3,
  AlertTriangle,
  Shield,
  TrendingDown,
  Brain,
  CreditCard,
  Snowflake,
  BookOpen
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: FileText,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Bot Management",
    href: "/admin/bots",
    icon: Bot,
  },
  {
    title: "Review Tracking",
    href: "/admin/reviews",
    icon: TrendingDown,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    title: "Discussions",
    href: "/admin/discussions",
    icon: MessageSquare,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: Snowflake,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Tools",
    href: "/admin/ai-tools",
    icon: Brain,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <p className="font-bold text-foreground">Admin Panel</p>
            <p className="text-xs text-muted-foreground">BadBizExposed.com</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
