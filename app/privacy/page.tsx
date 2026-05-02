import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | BadBizExposed",
  description: "Privacy Policy for BadBizExposed - how we collect, use, and protect your data."
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 2026</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Account Information:</strong> Email address, username, and optional profile details</li>
                <li><strong>Content:</strong> Complaints, comments, and other content you submit</li>
                <li><strong>Usage Data:</strong> How you interact with our platform, pages visited, and features used</li>
                <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide and improve our services</li>
                <li>Display your complaints and profile to other users</li>
                <li>Send important notifications about your account</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Analyze platform usage to improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Public Display:</strong> Your username and complaints are publicly visible</li>
                <li><strong>Service Providers:</strong> Third parties that help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to maintain your session, remember preferences, and analyze site usage. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for children under 13. We do not knowingly collect information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions or to exercise your rights, contact us at privacy@badbizexposed.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
