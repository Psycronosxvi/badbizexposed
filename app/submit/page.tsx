import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { ComplaintForm } from "@/components/complaint-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { FileText, Shield, CheckCircle, AlertTriangle } from "lucide-react"

interface SearchParams {
  company?: string
}

export default async function SubmitComplaintPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirect=/submit')
  }

  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  // Fetch categories, states, and businesses for the form
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  const { data: states } = await supabase.from('states').select('*').order('name')
  const { data: businesses } = await supabase.from('businesses').select('id, name, slug').order('name')

  // Mock data fallbacks
  const mockCategories = [
    { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
    { id: '2', name: 'Landlords', slug: 'landlords', description: null, icon: 'home', created_at: '' },
    { id: '3', name: 'HOA', slug: 'hoa', description: null, icon: 'users', created_at: '' },
    { id: '5', name: 'Contractors', slug: 'contractors', description: null, icon: 'hammer', created_at: '' },
    { id: '6', name: 'Moving Companies', slug: 'moving-companies', description: null, icon: 'truck', created_at: '' },
  ]

  const mockStates = [
    { id: '1', name: 'Alabama', abbreviation: 'AL', complaint_count: 0, created_at: '' },
    { id: '2', name: 'California', abbreviation: 'CA', complaint_count: 0, created_at: '' },
    { id: '3', name: 'Texas', abbreviation: 'TX', complaint_count: 0, created_at: '' },
    { id: '4', name: 'Florida', abbreviation: 'FL', complaint_count: 0, created_at: '' },
    { id: '5', name: 'New York', abbreviation: 'NY', complaint_count: 0, created_at: '' },
    { id: '6', name: 'Illinois', abbreviation: 'IL', complaint_count: 0, created_at: '' },
    { id: '7', name: 'Pennsylvania', abbreviation: 'PA', complaint_count: 0, created_at: '' },
    { id: '8', name: 'Ohio', abbreviation: 'OH', complaint_count: 0, created_at: '' },
    { id: '9', name: 'Georgia', abbreviation: 'GA', complaint_count: 0, created_at: '' },
    { id: '10', name: 'North Carolina', abbreviation: 'NC', complaint_count: 0, created_at: '' },
  ]

  const displayCategories = categories?.length ? categories : mockCategories
  const displayStates = states?.length ? states : mockStates

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              File a Complaint
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Share your experience to help others and hold businesses accountable. 
              Your complaint will be reviewed and published to help protect consumers.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <ComplaintForm 
                categories={displayCategories}
                states={displayStates}
                companies={businesses || []}
                preselectedCompany={params.company}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>You have the right to share truthful accounts of your experiences with businesses.</p>
                  <p>Factual complaints are protected speech. Be honest and specific about what happened.</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Tips for Effective Complaints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-success">1.</span>
                      Be specific about dates, times, and what happened
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">2.</span>
                      Include names of people you dealt with if possible
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">3.</span>
                      Describe the financial or emotional impact
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">4.</span>
                      Mention any evidence you have (emails, photos, contracts)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success">5.</span>
                      State what resolution you are seeking
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-destructive/10 border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Important Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Only submit truthful, factual accounts. False statements may result in 
                    removal of your complaint and potential legal consequences.
                  </p>
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
