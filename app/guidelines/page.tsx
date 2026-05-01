import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Community Guidelines | BadBiz Exposed",
  description: "Guidelines for posting complaints and participating in the BadBiz Exposed community.",
}

const dos = [
  "Be truthful and accurate in your descriptions",
  "Include specific details like dates, locations, and transaction numbers",
  "Provide evidence when possible (receipts, screenshots, correspondence)",
  "Focus on facts and your personal experience",
  "Update your complaint if the situation is resolved",
  "Be respectful to other community members",
  "Report violations when you see them"
]

const donts = [
  "Post false or misleading information",
  "Include personal attacks or hate speech",
  "Share private information of individuals (doxxing)",
  "Post complaints about personal disputes unrelated to business practices",
  "Use profanity or offensive language",
  "Spam or post duplicate complaints",
  "Impersonate others or create fake accounts"
]

const consequences = [
  {
    level: "Warning",
    description: "First-time minor violations may result in a warning and request to edit content."
  },
  {
    level: "Content Removal",
    description: "Violations will result in the removal of offending content without notice."
  },
  {
    level: "Temporary Suspension",
    description: "Repeated or serious violations may result in a temporary account suspension."
  },
  {
    level: "Permanent Ban",
    description: "Severe or repeated violations will result in permanent removal from the platform."
  }
]

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Community Guidelines
            </h1>
            <p className="text-xl text-muted-foreground">
              Rules and expectations for participating in our community.
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-muted-foreground leading-relaxed">
              BadBiz Exposed is committed to maintaining a trustworthy platform where consumers 
              can share authentic experiences. These guidelines help ensure that our community 
              remains a valuable resource for everyone. By using our platform, you agree to 
              follow these guidelines.
            </p>
          </section>

          {/* Do's and Don'ts */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dos.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="h-5 w-5" />
                  Do Not
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {donts.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Content Standards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Content Standards</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Accuracy:</strong> All complaints must be based on genuine 
                experiences. Fabricated or exaggerated claims undermine the integrity of our platform 
                and may result in legal consequences.
              </p>
              <p>
                <strong className="text-foreground">Relevance:</strong> Complaints should relate to business 
                practices, products, or services. Personal disputes, employment issues, or matters 
                unrelated to consumer experiences are not permitted.
              </p>
              <p>
                <strong className="text-foreground">Privacy:</strong> Do not share personal information of 
                individuals, including names, addresses, phone numbers, or photos of employees 
                without their consent.
              </p>
              <p>
                <strong className="text-foreground">Evidence:</strong> While not required, supporting evidence 
                strengthens your complaint and helps other consumers make informed decisions.
              </p>
            </div>
          </section>

          {/* Consequences */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Enforcement</h2>
            <p className="text-muted-foreground mb-6">
              Violations of these guidelines may result in the following actions:
            </p>
            <div className="space-y-4">
              {consequences.map((item, index) => (
                <Card key={item.level}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-500">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.level}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Reporting */}
          <section className="mb-12">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Report Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you see content that violates these guidelines, please report it using the 
                  report button on the complaint or comment. Our moderation team reviews all 
                  reports and takes appropriate action. Thank you for helping keep our community safe.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Last Updated */}
          <p className="text-sm text-muted-foreground text-center">
            Last updated: March 2025
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
