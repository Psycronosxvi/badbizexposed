import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Download, Mail, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Press & Media | BadBiz Exposed",
  description: "Press resources, media kit, and contact information for BadBiz Exposed.",
}

const pressReleases = [
  {
    date: "March 15, 2025",
    title: "BadBiz Exposed Launches New Business Response Feature",
    excerpt: "New feature allows businesses to claim profiles and respond directly to consumer complaints."
  },
  {
    date: "January 10, 2025",
    title: "BadBiz Exposed Reaches 50,000 Consumer Complaints",
    excerpt: "Platform milestone demonstrates growing consumer demand for transparency and accountability."
  },
  {
    date: "November 5, 2024",
    title: "BadBiz Exposed Partners with Consumer Protection Agencies",
    excerpt: "New partnerships enable streamlined complaint routing to appropriate regulatory bodies."
  },
  {
    date: "August 20, 2024",
    title: "BadBiz Exposed Launches Mobile App",
    excerpt: "Consumers can now file and track complaints on the go with our new mobile application."
  }
]

const mediaFeatures = [
  {
    outlet: "Consumer Reports",
    title: "How Online Complaint Platforms Are Changing Business Accountability",
    date: "February 2025"
  },
  {
    outlet: "TechCrunch",
    title: "BadBiz Exposed: The Yelp Alternative Focused on Consumer Protection",
    date: "December 2024"
  },
  {
    outlet: "The Wall Street Journal",
    title: "New Wave of Consumer Advocacy Platforms Gain Traction",
    date: "October 2024"
  }
]

const stats = [
  { label: "Complaints Filed", value: "50,000+" },
  { label: "Active Users", value: "100,000+" },
  { label: "Businesses Listed", value: "15,000+" },
  { label: "Countries", value: "10+" }
]

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resources for journalists, analysts, and media professionals covering BadBiz Exposed.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Press Releases */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Press Releases</h2>
              <div className="space-y-4">
                {pressReleases.map((release) => (
                  <Card key={release.title}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{release.date}</Badge>
                      </div>
                      <CardTitle className="text-lg">{release.title}</CardTitle>
                      <CardDescription>{release.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0 h-auto">
                        Read Full Release <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Media Coverage */}
              <h2 className="text-2xl font-bold mb-6 mt-12">Media Coverage</h2>
              <div className="space-y-4">
                {mediaFeatures.map((feature) => (
                  <Card key={feature.title}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{feature.outlet}</p>
                          <h3 className="font-semibold mt-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{feature.date}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Media Kit */}
              <Card>
                <CardHeader>
                  <CardTitle>Media Kit</CardTitle>
                  <CardDescription>
                    Download logos, brand guidelines, and fact sheets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Media Kit
                  </Button>
                </CardContent>
              </Card>

              {/* Press Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Press Contact</CardTitle>
                  <CardDescription>
                    For media inquiries and interview requests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Press Team</p>
                    <p className="text-sm text-muted-foreground">press@badbizexposed.com</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Press Team
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About BadBiz Exposed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    BadBiz Exposed is a consumer advocacy platform founded in 2024. 
                    Our mission is to empower consumers to share their experiences 
                    and hold businesses accountable through transparent complaint tracking 
                    and community support.
                  </p>
                  <Button asChild variant="link" className="p-0 h-auto mt-4">
                    <Link href="/about">
                      Learn More About Us <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
