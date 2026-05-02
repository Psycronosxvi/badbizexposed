"use client"

import { Shield } from "lucide-react"

interface AnimatedLogoProps {
  size?: number
  className?: string
}

export function AnimatedLogo({ size = 48, className = "" }: AnimatedLogoProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-accent ${className}`}
      style={{ width: size, height: size }}
    >
      <Shield 
        className="text-primary-foreground animate-pulse" 
        style={{ width: size * 0.6, height: size * 0.6 }} 
      />
    </div>
  )
}
