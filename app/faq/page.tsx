import { Metadata } from "next"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ | BadBiz Exposed",
  description: "Frequently asked questions about using BadBiz Exposed to file complaints and research businesses.",
}

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is BadBiz Exposed?",
        a: "BadBiz Exposed is a consumer advocacy platform that allows users to share their experiences with businesses, file complaints, and research companies before making purchasing decisions. Our goal is to promote transparency and accountability in the marketplace."
      },
      {
        q: "Is BadBiz Exposed free to use?",
        a: "Yes, our basic features are completely free. You can browse complaints, search for businesses, and submit your own complaints at no cost. We offer premium features for businesses and power users who want additional tools and analytics."
      },
      {
        q: "How is BadBiz Exposed different from other review sites?",
        a: "Unlike traditional review sites, we focus specifically on complaints and consumer protection. We verify complaints, allow businesses to respond, and track resolution progress. Our community-driven approach helps identify patterns of problematic behavior."
      }
    ]
  },
  {
    category: "Filing Complaints",
    questions: [
      {
        q: "How do I file a complaint?",
        a: "Create a free account, then click 'Submit Complaint' in the navigation. Fill out the form with details about your experience, select the business, and add any supporting evidence. Your complaint will be reviewed and published once it meets our guidelines."
      },
      {
        q: "Can I file a complaint anonymously?",
        a: "Yes, you can choose to hide your identity when submitting a complaint. Your personal information will be protected, but keep in mind that anonymous complaints may carry less weight with other users and businesses."
      },
      {
        q: "What types of complaints can I file?",
        a: "You can file complaints about any legitimate consumer issue including poor service, defective products, billing disputes, contract violations, deceptive practices, and more. We do not allow complaints that contain false information, personal attacks, or discrimination."
      },
      {
        q: "How long does review take?",
        a: "Most complaints are reviewed within 24-48 hours. Complex cases or those requiring additional verification may take longer. You will receive email notifications about the status of your complaint."
      }
    ]
  },
  {
    category: "For Businesses",
    questions: [
      {
        q: "How can a business respond to complaints?",
        a: "Business owners can claim their company profile by verifying their association with the business. Once verified, they can respond to complaints, provide resolutions, and update their business information."
      },
      {
        q: "Can a business remove complaints?",
        a: "Businesses cannot directly remove complaints. However, if a complaint violates our guidelines or contains false information, you can report it for review. Resolved complaints remain visible but are marked as resolved."
      },
      {
        q: "What are the benefits of claiming a business profile?",
        a: "Claimed profiles can respond to complaints, access analytics about their reputation, receive notifications about new complaints, and display a verified badge showing they are actively engaged with customers."
      }
    ]
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        q: "How do I delete my account?",
        a: "You can delete your account from your dashboard settings. Note that your complaints may remain on the platform but will be associated with a deleted account. Contact support if you need help with account deletion."
      },
      {
        q: "Is my personal information safe?",
        a: "We take privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. Read our Privacy Policy for complete details on how we protect your data."
      },
      {
        q: "Can I edit or delete my complaints?",
        a: "You can edit your complaints within 48 hours of posting. After that, you can request edits through our support team. Complaints can be deleted, but we encourage users to update them with resolutions instead."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about using BadBiz Exposed
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-2xl font-semibold mb-4">{section.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${section.category}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
