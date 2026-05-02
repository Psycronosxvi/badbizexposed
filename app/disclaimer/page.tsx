import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { AlertTriangle } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer | BadBizExposed",
  description: "Important disclaimer about user-generated content on BadBizExposed."
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-foreground">Disclaimer</h1>
          </div>
          <p className="text-muted-foreground mb-8">Last updated: April 2026</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">Important Notice</h2>
              <p className="text-muted-foreground leading-relaxed">
                BadBizExposed is a platform for user-generated content. The complaints, reviews, and opinions expressed on this website are those of individual users and do not represent the views, opinions, or endorsements of BadBizExposed or its operators.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">User-Generated Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                All complaints and reviews are submitted by users based on their personal experiences. BadBizExposed does not independently verify the accuracy, completeness, or truthfulness of user submissions. Users are solely responsible for the content they post.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">No Legal Advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                Information on this website is provided for informational purposes only and should not be construed as legal advice. If you have a legal dispute with a business, landlord, or other entity, we strongly recommend consulting with a qualified attorney.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Not an Endorsement</h2>
              <p className="text-muted-foreground leading-relaxed">
                The presence or absence of complaints about a business does not constitute an endorsement or recommendation by BadBizExposed. Consumers should conduct their own research and due diligence before engaging with any business.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Accuracy of Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to maintain a platform free from false or misleading content, we cannot guarantee the accuracy of all user submissions. Businesses mentioned on this platform have the right to respond to complaints and provide their perspective.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Changes Over Time</h2>
              <p className="text-muted-foreground leading-relaxed">
                Complaints reflect experiences at a specific point in time. Businesses may change their practices, ownership, or management. Past complaints may not reflect current business operations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Business Response Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Businesses mentioned on BadBizExposed have the right to create an account, respond to complaints, and provide their side of the story. We encourage constructive dialogue between consumers and businesses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Report False Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you believe content on this platform is false, defamatory, or violates our terms, please report it using the report function or contact us at reports@badbizexposed.com. We will review all reports and take appropriate action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                BadBizExposed and its operators shall not be held liable for any damages arising from the use of this platform, reliance on user-generated content, or decisions made based on information found here.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
