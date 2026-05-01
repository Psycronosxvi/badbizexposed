import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { XCircle, ArrowLeft, Heart } from "lucide-react"

export const metadata = {
  title: "Donation Cancelled - BadBizExposed",
  description: "Your donation was cancelled. You can try again anytime.",
}

export default function DonateCancelledPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Donation Cancelled
            </h1>
            
            <p className="text-muted-foreground mb-6">
              No worries! Your donation was cancelled and you haven&apos;t been charged. You can donate anytime you&apos;re ready.
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return Home
                </Button>
              </Link>
              <Link href="/pricing">
                <Button className="w-full gap-2">
                  <Heart className="h-4 w-4" />
                  Try Donating Again
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
