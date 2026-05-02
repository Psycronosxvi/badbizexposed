import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      )
    }

    // Convert dollars to cents
    const amountInCents = Math.round(amount * 100)

    // Create a Stripe Checkout session for the donation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to BadBizExposed",
              description: `Thank you for supporting consumer protection! Your $${amount} donation helps us continue our mission.`,
              images: ["https://badbizexposed.com/logo.png"],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")}/donate/cancelled`,
      metadata: {
        type: "donation",
        amount: amount.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe donation error:", error)
    return NextResponse.json(
      { error: "Failed to create donation session" },
      { status: 500 }
    )
  }
}
