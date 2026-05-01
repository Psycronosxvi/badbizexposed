"use client"

import { cn } from "@/lib/utils"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  animated?: boolean
}

export function BrandLogo({ 
  size = "md", 
  showText = true, 
  className = "",
  animated = true 
}: BrandLogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-2xl" },
    xl: { icon: 72, text: "text-3xl" },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Icon Mark - Eye with Alert */}
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r from-primary via-destructive to-primary blur-md opacity-60",
            animated && "animate-pulse"
          )}
          style={{ width: icon, height: icon }}
        />
        
        {/* Main icon container */}
        <div 
          className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-card via-secondary to-card border-2 border-primary/50"
          style={{ width: icon, height: icon }}
        >
          {/* Eye SVG */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-primary"
            style={{ width: icon * 0.6, height: icon * 0.6 }}
          >
            {/* Eye outline */}
            <path 
              d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={animated ? "animate-pulse" : ""}
            />
            {/* Pupil */}
            <circle 
              cx="12" 
              cy="12.5" 
              r="3.5" 
              fill="currentColor"
              className={animated ? "animate-pulse" : ""}
            />
            {/* Alert triangle inside eye */}
            <path 
              d="M12 10L13.5 13H10.5L12 10Z" 
              fill="white"
            />
            <circle cx="12" cy="14" r="0.5" fill="white" />
          </svg>
          
          {/* Scanning line effect */}
          {animated && (
            <div 
              className="absolute inset-0 overflow-hidden rounded-full"
              style={{ width: icon, height: icon }}
            >
              <div 
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"
              />
            </div>
          )}
        </div>
        
        {/* Alert badge */}
        <div 
          className={cn(
            "absolute -top-0.5 -right-0.5 bg-destructive rounded-full flex items-center justify-center",
            animated && "animate-bounce"
          )}
          style={{ width: icon * 0.35, height: icon * 0.35 }}
        >
          <span 
            className="text-destructive-foreground font-bold"
            style={{ fontSize: icon * 0.2 }}
          >
            !
          </span>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-black tracking-tight text-foreground", text)}>
            <span className="text-primary">BAD</span>
            <span>BIZ</span>
          </span>
          <span className={cn("font-bold tracking-widest text-muted-foreground uppercase", 
            size === "sm" ? "text-[8px]" : 
            size === "md" ? "text-[10px]" : 
            size === "lg" ? "text-xs" : "text-sm"
          )}>
            EXPOSED
          </span>
        </div>
      )}
    </div>
  )
}

// Alternative dramatic logo variant
export function BrandLogoAlt({ 
  size = "md", 
  showText = true, 
  className = "",
}: BrandLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-base" },
    md: { icon: 36, text: "text-lg" },
    lg: { icon: 48, text: "text-xl" },
    xl: { icon: 64, text: "text-2xl" },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Shield with magnifying glass */}
      <div className="relative">
        <svg 
          viewBox="0 0 32 32" 
          fill="none"
          style={{ width: icon, height: icon }}
        >
          {/* Shield background */}
          <path 
            d="M16 2L4 7V15C4 22.18 9.24 28.76 16 30C22.76 28.76 28 22.18 28 15V7L16 2Z" 
            className="fill-primary/20 stroke-primary"
            strokeWidth="1.5"
          />
          {/* Magnifying glass */}
          <circle 
            cx="14" 
            cy="14" 
            r="5" 
            className="stroke-foreground"
            strokeWidth="2"
            fill="none"
          />
          <line 
            x1="18" 
            y1="18" 
            x2="23" 
            y2="23" 
            className="stroke-foreground"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* X mark inside magnifying glass */}
          <path 
            d="M12 12L16 16M16 12L12 16" 
            className="stroke-destructive"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-black tracking-tight", text)}>
            <span className="text-destructive">WATCH</span>
            <span className="text-foreground">DOG</span>
          </span>
          <span className={cn(
            "font-semibold tracking-wider text-primary uppercase",
            size === "sm" ? "text-[7px]" : 
            size === "md" ? "text-[9px]" : 
            size === "lg" ? "text-[11px]" : "text-xs"
          )}>
            Consumer Network
          </span>
        </div>
      )}
    </div>
  )
}
