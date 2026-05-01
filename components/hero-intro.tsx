"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import Link from "next/link"
import { 
  AlertTriangle, 
  ArrowRight, 
  Shield, 
  Users, 
  FileText, 
  Map,
  Eye,
  Zap,
  Target
} from "lucide-react"

interface HeroIntroProps {
  stats: {
    total_complaints: number
    total_users: number
    total_companies: number
    resolved_complaints: number
  }
}

export function HeroIntro({ stats }: HeroIntroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  const headlines = [
    "Expose the Truth.",
    "Protect Consumers.",
    "Hold Them Accountable."
  ]

  const rotatingStats = [
    { value: stats.total_complaints.toLocaleString(), label: "Complaints Filed", icon: FileText },
    { value: stats.total_users.toLocaleString(), label: "Active Advocates", icon: Users },
    { value: stats.resolved_complaints.toLocaleString(), label: "Issues Resolved", icon: Shield },
    { value: "50", label: "States Covered", icon: Map },
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // Typewriter effect
    const text = "We see everything."
    let index = 0
    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)

    // Rotate stats
    const statsInterval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % rotatingStats.length)
    }, 3000)

    return () => {
      clearInterval(typeInterval)
      clearInterval(statsInterval)
    }
  }, [])

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden border-b border-border"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-destructive/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Scan lines effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <div 
            className={`flex-1 text-center lg:text-left transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Animated logo */}
            <div className="flex justify-center lg:justify-start mb-8">
              <BrandLogo size="xl" animated />
            </div>

            {/* Alert badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold mb-6 animate-pulse">
              <Eye className="h-4 w-4" />
              <span className="font-mono">{typedText}</span>
              <span className="w-0.5 h-4 bg-destructive animate-pulse" />
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 leading-tight">
              <span className="block">Bad Business?</span>
              <span className="block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-destructive to-primary animate-pulse">
                  We Expose Them.
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 text-pretty">
              Join thousands of advocates fighting back against{" "}
              <span className="text-destructive font-semibold">corrupt HOAs</span>,{" "}
              <span className="text-destructive font-semibold">predatory landlords</span>, and{" "}
              <span className="text-destructive font-semibold">dishonest businesses</span>.
              Your voice has power here.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/submit">
                <Button 
                  size="lg" 
                  className="gap-2 w-full sm:w-auto text-base px-8 bg-gradient-to-r from-destructive to-primary hover:from-destructive/90 hover:to-primary/90 shadow-lg shadow-primary/25 animate-glow-pulse"
                >
                  <AlertTriangle className="h-5 w-5" />
                  File a Complaint
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/companies">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 w-full sm:w-auto text-base px-8 border-primary/50 hover:bg-primary/10"
                >
                  <Target className="h-5 w-5" />
                  Browse Exposed Companies
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span>Anonymous Reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                <span>Real-Time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Community Verified</span>
              </div>
            </div>
          </div>

          {/* Right side - Animated stats display */}
          <div 
            className={`flex-1 max-w-lg w-full transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Central rotating stat */}
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl shadow-primary/10">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    {(() => {
                      const CurrentIcon = rotatingStats[currentStatIndex].icon
                      return <CurrentIcon className="h-8 w-8 text-primary" />
                    })()}
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-foreground mb-2 tabular-nums">
                    {rotatingStats[currentStatIndex].value}+
                  </div>
                  <div className="text-lg text-muted-foreground font-medium">
                    {rotatingStats[currentStatIndex].label}
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {rotatingStats.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentStatIndex 
                          ? "w-8 bg-primary" 
                          : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="hidden md:block absolute -top-4 -left-4 bg-card border border-border rounded-lg p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">156</div>
                    <div className="text-xs text-muted-foreground">This Week</div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute -bottom-4 -right-4 bg-card border border-border rounded-lg p-4 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">89%</div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-destructive/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-live" />
                <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
