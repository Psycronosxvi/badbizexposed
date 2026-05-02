import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Eye, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | BadBiz Exposed",
  description: "Learn about BadBiz Exposed's mission to empower consumers and promote business accountability.",
}

const values = [
  {
    icon: Shield,
    title: "Consumer Protection",
    description: "We believe every consumer deserves a voice. Our platform provides a safe space to share experiences and warn others about problematic businesses."
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "We promote transparency in the marketplace by making business practices visible to consumers before they make purchasing decisions."
  },
  {
    icon: Users,
    title: "Community",
    description: "Our strength comes from our community. Together, consumers can identify patterns and hold businesses accountable for their actions."
  },
  {
    icon: Heart,
    title: "Fairness",
    description: "We give businesses the opportunity to respond and make things right. Resolution and improvement are always our preferred outcomes."
  }
]

const stats = [
  { value: "50,000+", label: "Complaints Filed" },
  { value: "15,000+", label: "Businesses Listed" },
  { value: "100,000+", label: "Active Users" },
  { value: "35%", label: "Resolution Rate" }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About BadBiz Exposed
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering consumers to share experiences and hold businesses accountable since 2024.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                BadBiz Exposed was founded with a simple but powerful mission: to give consumers 
                a platform where their voices matter. Too often, consumers feel powerless when 
                they have negative experiences with businesses. Traditional review sites can be 
                manipulated, and formal complaint processes are slow and bureaucratic.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                We created BadBiz Exposed to be different. Our platform is designed specifically 
                for consumer complaints, with features that promote accountability, verification, 
                and resolution. We believe that when consumers share their experiences openly, 
                businesses are motivated to do better, and other consumers can make more informed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-muted-foreground text-lg">
              BadBiz Exposed is run by a dedicated team of consumer advocates, technologists, 
              and community managers who are passionate about fairness in the marketplace. 
              We are committed to maintaining a platform that serves consumers while giving 
              businesses a fair opportunity to respond and improve.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
