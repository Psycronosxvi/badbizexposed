import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | BadBizExposed",
  description: "Terms of Service for using BadBizExposed platform."
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 2026</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using BadBizExposed (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                BadBizExposed is a consumer complaint platform that allows users to share their experiences with businesses, landlords, HOAs, and other entities. The Service provides a forum for consumers to document complaints and warn others about potential issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                To submit complaints, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information when creating an account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. User Content Guidelines</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When submitting complaints or comments, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide truthful and accurate information</li>
                <li>Only share your own firsthand experiences</li>
                <li>Not post defamatory, libelous, or knowingly false content</li>
                <li>Not include private personal information about others without consent</li>
                <li>Not use the platform for harassment, threats, or illegal purposes</li>
                <li>Not post spam, advertisements, or promotional content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Content Ownership</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of content you submit. However, by posting content, you grant BadBizExposed a non-exclusive, royalty-free license to use, display, and distribute your content on the platform and for promotional purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Content Moderation</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to remove, edit, or freeze any content that violates these terms or that we deem inappropriate. Repeated violations may result in account suspension or termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided &quot;as is&quot; without warranties of any kind. We do not verify the accuracy of user-submitted content. Users should conduct their own research before making decisions based on information found on this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                BadBizExposed shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service or reliance on user-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at legal@badbizexposed.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
