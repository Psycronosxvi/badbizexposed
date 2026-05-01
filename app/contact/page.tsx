"use client"

import { useState } from "react"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, FileText, Building2, Loader2, CheckCircle } from "lucide-react"

const contactReasons = [
  { value: "general", label: "General Inquiry" },
  { value: "complaint-help", label: "Help with a Complaint" },
  { value: "business", label: "Business Owner Inquiry" },
  { value: "press", label: "Press & Media" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "bug", label: "Report a Bug" },
  { value: "other", label: "Other" }
]

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "For general inquiries and support",
    contact: "support@badbizexposed.com"
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Get help from our community",
    contact: "Visit Discussions"
  },
  {
    icon: FileText,
    title: "Press Inquiries",
    description: "For media and press requests",
    contact: "press@badbizexposed.com"
  },
  {
    icon: Building2,
    title: "Business Support",
    description: "For business owners and claims",
    contact: "business@badbizexposed.com"
  }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or need help? We are here for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we will get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We will respond within 24-48 hours.
                    </p>
                    <Button 
                      className="mt-4" 
                      variant="outline" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Contact</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactReasons.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Brief subject line" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us how we can help..."
                        rows={5}
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Other Ways to Reach Us</h2>
              <div className="grid gap-4">
                {contactMethods.map((method) => (
                  <Card key={method.title}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <method.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{method.title}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <p className="text-sm text-primary mt-1">{method.contact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Response Times</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>General inquiries: 24-48 hours</li>
                    <li>Complaint assistance: 24-48 hours</li>
                    <li>Business claims: 3-5 business days</li>
                    <li>Press inquiries: Same day</li>
                  </ul>
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
