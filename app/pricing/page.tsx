import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { PricingCards } from "@/components/pricing-cards"

export const metadata: Metadata = {
  title: 'Premium Membership - Unlock Full Features',
  description: 'Upgrade to BadBizExposed Premium for unlimited complaints, priority visibility, analytics, and more. Just $1.99/month.',
  openGraph: {
    title: 'Premium Membership - BadBizExposed',
    description: 'Get unlimited complaints, priority visibility, and exclusive features.',
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get unlimited access to all features and help expose bad businesses with priority visibility for your complaints.
            </p>
          </div>
          
          <PricingCards />
          
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes! You can cancel your subscription at any time from your dashboard. 
                  You&apos;ll continue to have access until the end of your billing period.
                </p>
              </div>
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">What happens to my complaints if I cancel?</h3>
                <p className="text-muted-foreground">
                  Your complaints remain public. You&apos;ll just lose access to premium features 
                  like analytics, exports, and priority visibility.
                </p>
              </div>
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Is my payment secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. All payments are processed securely through Stripe. 
                  We never store your credit card information.
                </p>
              </div>
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Do I need to pay to submit complaints?</h3>
                <p className="text-muted-foreground">
                  No! Free users can submit up to 3 complaints per month. 
                  Premium removes this limit and adds extra features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
