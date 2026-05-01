"use client"

import { BadgeCheck, Shield, ShieldCheck } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  level?: 'basic' | 'verified' | 'trusted'
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  className?: string
}

export function VerifiedBadge({ 
  level = 'verified', 
  size = 'md',
  showTooltip = true,
  className 
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const levelConfig = {
    basic: {
      icon: Shield,
      color: 'text-blue-400',
      label: 'Verified Email',
      description: 'This user has verified their email address'
    },
    verified: {
      icon: BadgeCheck,
      color: 'text-primary',
      label: 'Verified User',
      description: 'This user has verified their identity'
    },
    trusted: {
      icon: ShieldCheck,
      color: 'text-green-500',
      label: 'Trusted Contributor',
      description: 'This user is a trusted community member with multiple verified complaints'
    }
  }

  const config = levelConfig[level]
  const Icon = config.icon

  const badge = (
    <Icon className={cn(sizeClasses[size], config.color, className)} />
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">{badge}</span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
