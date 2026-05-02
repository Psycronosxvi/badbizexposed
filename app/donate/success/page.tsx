import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Heart, CheckCircle, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Thank You for Your Donation - BadBizExposed",
  description: "Your donation has been received. Thank you for supporting consumer protection.",
}

export default function DonateSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Thank You!
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Your generous donation has been received. You&apos;re helping us protect consumers and expose bad businesses.
            </p>

            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">
                Every donation makes a difference
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full gap-2">
                  Return Home
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" className="w-full">
                  Submit a Complaint
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
