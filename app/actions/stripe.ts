'use server'

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { PRODUCTS, isSubscription } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function startCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('host') || ''
  const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`

  // Create checkout session for subscription
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: user?.email || undefined,
    metadata: {
      userId: user?.id || '',
      productId: product.id,
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: isSubscription(product) ? {
            interval: product.interval!,
          } : undefined,
        },
        quantity: 1,
      },
    ],
    mode: isSubscription(product) ? 'subscription' : 'payment',
  })

  return session.client_secret
}

export async function createBillingPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get customer ID from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    throw new Error('No subscription found')
  }

  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('host') || ''
  const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${baseUrl}/dashboard`,
  })

  return session.url
}

export async function getSubscriptionStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { isPremium: false, subscription: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, stripe_customer_id, subscription_status, subscription_end_date')
    .eq('id', user.id)
    .single()

  return {
    isPremium: profile?.is_premium || false,
    subscriptionStatus: profile?.subscription_status || null,
    subscriptionEndDate: profile?.subscription_end_date || null,
  }
}
