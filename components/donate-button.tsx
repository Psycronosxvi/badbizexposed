"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Coffee, Gift, Sparkles, Loader2 } from "lucide-react"

const donationAmounts = [
  { amount: 5, label: "$5", icon: Coffee, description: "Buy us a coffee" },
  { amount: 10, label: "$10", icon: Heart, description: "Show some love" },
  { amount: 25, label: "$25", icon: Gift, description: "Generous supporter" },
  { amount: 50, label: "$50", icon: Sparkles, description: "Champion donor" },
]

interface DonateButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function DonateButton({ 
  variant = "outline", 
  size = "default", 
  className = "",
  showIcon = true,
  children
}: DonateButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  async function handleDonate(amount: number) {
    setIsLoading(true)
    setSelectedAmount(amount)

    try {
      const response = await fetch("/api/stripe/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("No checkout URL returned")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Donation error:", error)
      setIsLoading(false)
    }
  }

  function handleCustomDonate() {
    const amount = parseFloat(customAmount)
    if (amount >= 1) {
      handleDonate(amount)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          {showIcon && <Heart className="h-4 w-4" />}
          {children || "Donate"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Support BadBizExposed
          </DialogTitle>
          <DialogDescription>
            Your donation helps us continue exposing bad businesses and protecting consumers. Every contribution makes a difference.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {donationAmounts.map((tier) => {
            const Icon = tier.icon
            const isSelected = selectedAmount === tier.amount
            return (
              <button
                key={tier.amount}
                onClick={() => handleDonate(tier.amount)}
                disabled={isLoading}
                className={`
                  relative p-4 rounded-lg border-2 transition-all text-left
                  ${isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                  }
                  ${isLoading && selectedAmount === tier.amount ? "opacity-75" : ""}
                  disabled:cursor-not-allowed
                `}
              >
                {isLoading && selectedAmount === tier.amount && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
                <Icon className={`h-6 w-6 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-bold text-lg text-foreground">{tier.label}</p>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
              </button>
            )
          })}
        </div>

        {/* Custom Amount */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Or enter a custom amount:</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-7 pr-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button 
              onClick={handleCustomDonate}
              disabled={isLoading || !customAmount || parseFloat(customAmount) < 1}
            >
              {isLoading && selectedAmount === parseFloat(customAmount) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Donate"
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Secure payment processed by Stripe. You&apos;ll be redirected to complete your donation.
        </p>
      </DialogContent>
    </Dialog>
  )
}
