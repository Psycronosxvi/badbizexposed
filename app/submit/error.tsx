"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubmitError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error("[v0] Submit page error:", error)
    console.error("[v0] Error stack:", error.stack)
    console.error("[v0] Error message:", error.message)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mx-auto">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong loading this page
          </h1>
          <p className="text-muted-foreground">
            We had trouble loading the complaint form. Please try again.
          </p>
          {showDetails && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="text-sm font-mono text-destructive break-all">{error.message}</p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">Digest: {error.digest}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-muted-foreground underline"
        >
          {showDetails ? "Hide" : "Show"} error details
        </button>
      </div>
    </div>
  )
}
