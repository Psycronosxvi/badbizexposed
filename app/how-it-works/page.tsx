import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  FileText, 
  Search, 
  Users, 
  Shield, 
  TrendingUp, 
  MessageSquare,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works | BadBiz Exposed",
  description: "Learn how BadBiz Exposed helps consumers share experiences and hold businesses accountable.",
}

const steps = [
  {
    icon: FileText,
    title: "Submit Your Complaint",
    description: "Create an account and submit your complaint with details about your experience. Include evidence like receipts, photos, or correspondence to strengthen your case."
  },
  {
    icon: Search,
    title: "Review & Verification",
    description: "Our team reviews submissions to ensure they meet our community guidelines. We verify the legitimacy of complaints while protecting user privacy."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Other users can upvote, comment, and share similar experiences. This helps identify patterns of behavior and builds a community of informed consumers."
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor the status of your complaint and see how businesses respond. Resolved complaints help build a record of accountability."
  }
]

const features = [
  {
    icon: Shield,
    title: "Anonymous Reporting",
    description: "Choose to submit complaints anonymously to protect your identity while still holding businesses accountable."
  },
  {
    icon: MessageSquare,
    title: "Business Responses",
    description: "Businesses can claim their profiles and respond to complaints, creating a dialogue and opportunity for resolution."
  },
  {
    icon: CheckCircle,
    title: "Verified Reviews",
    description: "Our verification system helps identify credible complaints and rewards users who contribute quality content."
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How BadBiz Exposed Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Our platform empowers consumers to share their experiences, 
              research businesses, and make informed decisions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/submit">Submit a Complaint</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/companies">Browse Companies</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">The Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card key={step.title} className="relative">
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <CardHeader>
                    <step.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of consumers who are making their voices heard.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
