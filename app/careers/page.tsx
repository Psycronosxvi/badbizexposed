import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Briefcase, Clock, ArrowRight, Heart, Zap, Users, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers | BadBiz Exposed",
  description: "Join our team and help empower consumers worldwide. View open positions at BadBiz Exposed.",
}

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision coverage for you and your family."
  },
  {
    icon: Globe,
    title: "Remote First",
    description: "Work from anywhere. We are a distributed team across multiple time zones."
  },
  {
    icon: Zap,
    title: "Growth & Learning",
    description: "Annual learning stipend and opportunities for professional development."
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Collaborative environment with regular team events and offsites."
  }
]

const openPositions = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and scale our platform using Next.js, TypeScript, and Supabase."
  },
  {
    title: "Content Moderator",
    department: "Trust & Safety",
    location: "Remote",
    type: "Full-time",
    description: "Review and moderate user-submitted content to maintain community standards."
  },
  {
    title: "Customer Support Specialist",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    description: "Help consumers and businesses navigate our platform and resolve issues."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design intuitive user experiences that empower consumers."
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive awareness and growth through strategic marketing initiatives."
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us empower consumers and promote business accountability. 
              We are building something meaningful, and we want you to be part of it.
            </p>
            <Button asChild size="lg">
              <a href="#positions">View Open Positions</a>
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
            <p className="text-center text-muted-foreground mb-12">
              We are always looking for talented people to join our team.
            </p>
            
            <div className="space-y-4">
              {openPositions.map((position) => (
                <Card key={position.title} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <CardDescription className="mt-2">{position.description}</CardDescription>
                      </div>
                      <Button className="flex-shrink-0">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Do not See the Right Role?</h2>
            <p className="text-muted-foreground mb-8">
              We are always interested in meeting talented people. 
              Send us your resume and tell us how you would like to contribute.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
