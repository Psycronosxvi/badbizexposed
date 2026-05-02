"use client"

import { useState } from "react"
import { PRODUCTS, FREE_TIER_LIMITS } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, Crown } from "lucide-react"
import StripeCheckout from "@/components/stripe-checkout"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function PricingCards() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSelectPlan = async (productId: string) => {
    setIsLoading(true)
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login?next=/pricing')
      return
    }
    
    setSelectedPlan(productId)
    setIsLoading(false)
  }

  const monthlyPlan = PRODUCTS.find(p => p.id === 'premium-monthly')!
  const yearlyPlan = PRODUCTS.find(p => p.id === 'premium-yearly')!

  if (selectedPlan) {
    return (
      <div className="max-w-lg mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedPlan(null)}
          className="mb-4"
        >
          &larr; Back to plans
        </Button>
        <StripeCheckout productId={selectedPlan} />
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
      {/* Free Plan */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">Free</CardTitle>
          <CardDescription>Get started with basic features</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground">/forever</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <span className="text-sm">{FREE_TIER_LIMITS.complaintsPerMonth} complaints/month</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <span className="text-sm">Basic search</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <span className="text-sm">Upvote & comment</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No exports</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No priority visibility</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push('/auth/sign-up')}>
            Sign Up Free
          </Button>
        </CardFooter>
      </Card>

      {/* Monthly Plan */}
      <Card className="border-primary relative">
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Most Popular
        </Badge>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Premium Monthly
          </CardTitle>
          <CardDescription>Full access, billed monthly</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">${(monthlyPlan.priceInCents / 100).toFixed(2)}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {monthlyPlan.features.slice(0, 8).map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSelectPlan('premium-monthly')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Get Premium
          </Button>
        </CardFooter>
      </Card>

      {/* Yearly Plan */}
      <Card className="border-border">
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success">
          Save 16%
        </Badge>
        <CardHeader className="pt-8">
          <CardTitle className="text-xl flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Premium Annual
          </CardTitle>
          <CardDescription>Best value, billed yearly</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">${(yearlyPlan.priceInCents / 100).toFixed(2)}</span>
            <span className="text-muted-foreground">/year</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {yearlyPlan.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline"
            className="w-full" 
            onClick={() => handleSelectPlan('premium-yearly')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Get Annual
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
