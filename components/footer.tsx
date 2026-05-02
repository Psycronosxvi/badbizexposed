import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Platform: [
      { href: "/companies", label: "Companies" },
      { href: "/complaints", label: "Complaints" },
      { href: "/map", label: "Complaint Map" },
      { href: "/discussions", label: "Discussions" },
    ],
    Resources: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/your-rights", label: "Know Your Rights" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/guides", label: "Consumer Guides" },
    ],
    Company: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/press", label: "Press" },
      { href: "/careers", label: "Careers" },
    ],
    Legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/guidelines", label: "Community Guidelines" },
    ],
  }

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <BrandLogo size="md" animated={false} />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering consumers to share experiences and hold businesses accountable.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Protecting consumer rights since 2024
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://www.facebook.com/bbeusa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
                title="Facebook: BBEUSA"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/badbizexpo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on X (Twitter)"
                title="X: @badbizexpo"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/badbizexo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
                title="Instagram: @badbizexo"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com/@badbizexposedx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on TikTok"
                title="TikTok: @badbizexposedx"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a
                href="mailto:badbizexposedx@gmail.com"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Email us"
                title="Email: badbizexposedx@gmail.com"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {currentYear} BadBizExposed. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
