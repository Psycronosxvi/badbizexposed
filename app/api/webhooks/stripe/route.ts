import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const customerId = session.customer as string

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  // Update profile with customer ID and premium status
  await supabaseAdmin
    .from('profiles')
    .update({
      stripe_customer_id: customerId,
      is_premium: true,
      subscription_status: 'active',
      subscription_start_date: new Date().toISOString(),
    })
    .eq('id', userId)

  // Log the payment
  await supabaseAdmin.from('payment_logs').insert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_session_id: session.id,
    amount: session.amount_total,
    currency: session.currency,
    status: 'completed',
    type: 'subscription_start',
  })
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  const isActive = subscription.status === 'active' || subscription.status === 'trialing'
  const periodEnd = new Date(subscription.current_period_end * 1000)

  await supabaseAdmin
    .from('profiles')
    .update({
      is_premium: isActive,
      subscription_status: subscription.status,
      subscription_end_date: periodEnd.toISOString(),
    })
    .eq('id', profile.id)
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  await supabaseAdmin
    .from('profiles')
    .update({
      is_premium: false,
      subscription_status: 'canceled',
    })
    .eq('id', profile.id)

  // Log cancellation
  await supabaseAdmin.from('payment_logs').insert({
    user_id: profile.id,
    stripe_customer_id: customerId,
    status: 'canceled',
    type: 'subscription_cancel',
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Log successful payment
  await supabaseAdmin.from('payment_logs').insert({
    user_id: profile.id,
    stripe_customer_id: customerId,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    type: 'subscription_renewal',
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Log failed payment
  await supabaseAdmin.from('payment_logs').insert({
    user_id: profile.id,
    stripe_customer_id: customerId,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    type: 'payment_failed',
  })
}
