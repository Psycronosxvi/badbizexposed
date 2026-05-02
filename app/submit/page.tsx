import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { ComplaintForm } from "@/components/complaint-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { FileText, Shield, CheckCircle, AlertTriangle } from "lucide-react"

// Mock data as fallback
const mockCategories = [
  { id: '1', name: 'Property Management', slug: 'property-management', description: null, icon: 'building', created_at: '' },
  { id: '2', name: 'Landlords', slug: 'landlords', description: null, icon: 'home', created_at: '' },
  { id: '3', name: 'HOA', slug: 'hoa', description: null, icon: 'users', created_at: '' },
  { id: '4', name: 'Retail', slug: 'retail', description: null, icon: 'store', created_at: '' },
  { id: '5', name: 'Contractors', slug: 'contractors', description: null, icon: 'hammer', created_at: '' },
  { id: '6', name: 'Moving Companies', slug: 'moving-companies', description: null, icon: 'truck', created_at: '' },
  { id: '7', name: 'Auto Services', slug: 'auto-services', description: null, icon: 'car', created_at: '' },
  { id: '8', name: 'Healthcare', slug: 'healthcare', description: null, icon: 'heart', created_at: '' },
  { id: '9', name: 'Financial Services', slug: 'financial-services', description: null, icon: 'dollar', created_at: '' },
  { id: '10', name: 'Telecommunications', slug: 'telecommunications', description: null, icon: 'phone', created_at: '' },
]

const mockStates = [
  { id: '1', name: 'Alabama', abbreviation: 'AL', complaint_count: 0, created_at: '' },
  { id: '2', name: 'Alaska', abbreviation: 'AK', complaint_count: 0, created_at: '' },
  { id: '3', name: 'Arizona', abbreviation: 'AZ', complaint_count: 0, created_at: '' },
  { id: '4', name: 'Arkansas', abbreviation: 'AR', complaint_count: 0, created_at: '' },
  { id: '5', name: 'California', abbreviation: 'CA', complaint_count: 0, created_at: '' },
  { id: '6', name: 'Colorado', abbreviation: 'CO', complaint_count: 0, created_at: '' },
  { id: '7', name: 'Connecticut', abbreviation: 'CT', complaint_count: 0, created_at: '' },
  { id: '8', name: 'Delaware', abbreviation: 'DE', complaint_count: 0, created_at: '' },
  { id: '9', name: 'Florida', abbreviation: 'FL', complaint_count: 0, created_at: '' },
  { id: '10', name: 'Georgia', abbreviation: 'GA', complaint_count: 0, created_at: '' },
  { id: '11', name: 'Hawaii', abbreviation: 'HI', complaint_count: 0, created_at: '' },
  { id: '12', name: 'Idaho', abbreviation: 'ID', complaint_count: 0, created_at: '' },
  { id: '13', name: 'Illinois', abbreviation: 'IL', complaint_count: 0, created_at: '' },
  { id: '14', name: 'Indiana', abbreviation: 'IN', complaint_count: 0, created_at: '' },
  { id: '15', name: 'Iowa', abbreviation: 'IA', complaint_count: 0, created_at: '' },
  { id: '16', name: 'Kansas', abbreviation: 'KS', complaint_count: 0, created_at: '' },
  { id: '17', name: 'Kentucky', abbreviation: 'KY', complaint_count: 0, created_at: '' },
  { id: '18', name: 'Louisiana', abbreviation: 'LA', complaint_count: 0, created_at: '' },
  { id: '19', name: 'Maine', abbreviation: 'ME', complaint_count: 0, created_at: '' },
  { id: '20', name: 'Maryland', abbreviation: 'MD', complaint_count: 0, created_at: '' },
  { id: '21', name: 'Massachusetts', abbreviation: 'MA', complaint_count: 0, created_at: '' },
  { id: '22', name: 'Michigan', abbreviation: 'MI', complaint_count: 0, created_at: '' },
  { id: '23', name: 'Minnesota', abbreviation: 'MN', complaint_count: 0, created_at: '' },
  { id: '24', name: 'Mississippi', abbreviation: 'MS', complaint_count: 0, created_at: '' },
  { id: '25', name: 'Missouri', abbreviation: 'MO', complaint_count: 0, created_at: '' },
  { id: '26', name: 'Montana', abbreviation: 'MT', complaint_count: 0, created_at: '' },
  { id: '27', name: 'Nebraska', abbreviation: 'NE', complaint_count: 0, created_at: '' },
  { id: '28', name: 'Nevada', abbreviation: 'NV', complaint_count: 0, created_at: '' },
  { id: '29', name: 'New Hampshire', abbreviation: 'NH', complaint_count: 0, created_at: '' },
  { id: '30', name: 'New Jersey', abbreviation: 'NJ', complaint_count: 0, created_at: '' },
  { id: '31', name: 'New Mexico', abbreviation: 'NM', complaint_count: 0, created_at: '' },
  { id: '32', name: 'New York', abbreviation: 'NY', complaint_count: 0, created_at: '' },
  { id: '33', name: 'North Carolina', abbreviation: 'NC', complaint_count: 0, created_at: '' },
  { id: '34', name: 'North Dakota', abbreviation: 'ND', complaint_count: 0, created_at: '' },
  { id: '35', name: 'Ohio', abbreviation: 'OH', complaint_count: 0, created_at: '' },
  { id: '36', name: 'Oklahoma', abbreviation: 'OK', complaint_count: 0, created_at: '' },
  { id: '37', name: 'Oregon', abbreviation: 'OR', complaint_count: 0, created_at: '' },
  { id: '38', name: 'Pennsylvania', abbreviation: 'PA', complaint_count: 0, created_at: '' },
  { id: '39', name: 'Rhode Island', abbreviation: 'RI', complaint_count: 0, created_at: '' },
  { id: '40', name: 'South Carolina', abbreviation: 'SC', complaint_count: 0, created_at: '' },
  { id: '41', name: 'South Dakota', abbreviation: 'SD', complaint_count: 0, created_at: '' },
  { id: '42', name: 'Tennessee', abbreviation: 'TN', complaint_count: 0, created_at: '' },
  { id: '43', name: 'Texas', abbreviation: 'TX', complaint_count: 0, created_at: '' },
  { id: '44', name: 'Utah', abbreviation: 'UT', complaint_count: 0, created_at: '' },
  { id: '45', name: 'Vermont', abbreviation: 'VT', complaint_count: 0, created_at: '' },
  { id: '46', name: 'Virginia', abbreviation: 'VA', complaint_count: 0, created_at: '' },
  { id: '47', name: 'Washington', abbreviation: 'WA', complaint_count: 0, created_at: '' },
  { id: '48', name: 'West Virginia', abbreviation: 'WV', complaint_count: 0, created_at: '' },
  { id: '49', name: 'Wisconsin', abbreviation: 'WI', complaint_count: 0, created_at: '' },
  { id: '50', name: 'Wyoming', abbreviation: 'WY', complaint_count: 0, created_at: '' },
]

interface SearchParams {
  company?: string
}

export default async function SubmitComplaintPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Safely get search params
  let params: SearchParams = {}
  try {
    params = await searchParams
  } catch (e) {
    console.error("[v0] Error parsing searchParams:", e)
  }

  // Create Supabase client
  let supabase
  try {
    supabase = await createClient()
  } catch (e) {
    console.error("[v0] Error creating Supabase client:", e)
    // Return fallback UI if Supabase fails
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderWrapper />
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Service Temporarily Unavailable</h1>
            <p className="text-muted-foreground">Please try again in a moment.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Get current user - wrapped in try-catch
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (e) {
    console.error("[v0] Error getting user:", e)
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirect=/submit')
  }

  // Fetch form data with fallbacks
  let categories = mockCategories
  let states = mockStates
  let businesses: { id: string; name: string; slug: string }[] = []

  try {
    const [catResult, stateResult, bizResult] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('states').select('*').order('name'),
      supabase.from('businesses').select('id, name, slug').order('name')
    ])
    
    if (catResult.data && catResult.data.length > 0) {
      categories = catResult.data
    }
    if (stateResult.data && stateResult.data.length > 0) {
      states = stateResult.data
    }
    if (bizResult.data) {
      businesses = bizResult.data
    }
  } catch (e) {
    console.error("[v0] Error fetching form data:", e)
    // Continue with mock data
  }

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
                categories={categories}
                states={states}
                companies={businesses}
                preselectedCompany={params?.company || ""}
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
