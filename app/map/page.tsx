import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { USComplaintMap } from "@/components/us-complaint-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { MapPin, Building2, AlertTriangle, Filter, Clock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Complaint Map - Mobile, Alabama & Nationwide',
  description: 'Interactive map of consumer complaints. View complaints by location, filter by type and time period. Focus on Mobile, Alabama and surrounding areas.',
}

// Mobile, Alabama complaint locations
const mobileComplaints = [
  {
    id: 'mobile-1',
    name: 'Oak Tree Apartments',
    address: '1234 Oak Tree Dr, Mobile, AL 36606',
    lat: 30.6954,
    lng: -88.0399,
    complaints: 287,
    topCategories: ['Pest Problems', 'Maintenance Issues', 'Safety Concerns'],
  },
  {
    id: 'mobile-2',
    name: 'Plantation Apartments',
    address: '5678 Plantation Blvd, Mobile, AL 36608',
    lat: 30.6820,
    lng: -88.0520,
    complaints: 312,
    topCategories: ['Billing/Hidden Fees', 'Staff Behavior', 'Mold Issues'],
  },
  {
    id: 'mobile-3',
    name: 'Springhill Apartments',
    address: '910 Springhill Ave, Mobile, AL 36604',
    lat: 30.6943,
    lng: -88.0431,
    complaints: 187,
    topCategories: ['Lease Issues', 'Maintenance Neglect', 'Late Repairs'],
  },
  {
    id: 'mobile-4',
    name: 'Midtown Property Management',
    address: '2345 Midtown Pkwy, Mobile, AL 36606',
    lat: 30.7012,
    lng: -88.0812,
    complaints: 156,
    topCategories: ['Late Repairs', 'Poor Communication'],
  },
  {
    id: 'mobile-5',
    name: 'Gulf Coast Rentals',
    address: '3456 Airport Blvd, Mobile, AL 36608',
    lat: 30.6734,
    lng: -88.1234,
    complaints: 145,
    topCategories: ['Hidden Fees', 'Property Condition'],
  },
  {
    id: 'mobile-6',
    name: 'Downtown Mobile Condos',
    address: '789 Commerce St, Mobile, AL 36601',
    lat: 30.6901,
    lng: -88.0465,
    complaints: 98,
    topCategories: ['HOA Overreach', 'Assessment Increases'],
  },
]

// Additional major US cities for comparison
const majorCities = [
  {
    name: 'Los Angeles, CA',
    complaints: 523,
    topIssue: 'Maintenance Neglect',
  },
  {
    name: 'Houston, TX',
    complaints: 456,
    topIssue: 'Security Deposit Theft',
  },
  {
    name: 'New York, NY',
    complaints: 834,
    topIssue: 'Lease Violations',
  },
  {
    name: 'Miami, FL',
    complaints: 478,
    topIssue: 'Mold Issues',
  },
  {
    name: 'Chicago, IL',
    complaints: 567,
    topIssue: 'Maintenance Neglect',
  },
  {
    name: 'Philadelphia, PA',
    complaints: 412,
    topIssue: 'Security Deposit Theft',
  },
  {
    name: 'Atlanta, GA',
    complaints: 423,
    topIssue: 'HOA Overreach',
  },
  {
    name: 'San Francisco, CA',
    complaints: 412,
    topIssue: 'Hidden Fees',
  },
]

async function getMapData() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // Get states with complaint counts
  const { data: states } = await supabase
    .from('states')
    .select('*')
    .order('name')

  return {
    user: profile ? { ...profile, email: user?.email } : null,
    states: states || [],
  }
}

export default async function MapPage() {
  const { user, states } = await getMapData()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              Complaint Map
            </h1>
            <p className="text-muted-foreground">
              Explore complaints by location. Click on states or markers to see detailed information.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Complaint Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="safety">Safety Concerns</SelectItem>
                    <SelectItem value="maintenance">Maintenance Issues</SelectItem>
                    <SelectItem value="billing">Billing/Fees</SelectItem>
                    <SelectItem value="pest">Pest Problems</SelectItem>
                    <SelectItem value="deposit">Security Deposit</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* US Map */}
          <USComplaintMap states={states} />

          {/* Mobile, Alabama Focus Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  Focus: Mobile, Alabama
                </h2>
                <p className="text-muted-foreground">
                  High-complaint areas under active monitoring
                </p>
              </div>
              <Badge variant="destructive" className="text-lg px-4 py-1">
                {mobileComplaints.reduce((sum, c) => sum + c.complaints, 0)} Total Complaints
              </Badge>
            </div>

            {/* Mobile Complaint Locations */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mobileComplaints.map((location, index) => (
                <Card key={location.id} className={`bg-card border-border ${index < 3 ? 'border-destructive/50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${index < 3 ? 'bg-destructive/10' : 'bg-secondary'}`}>
                          <Building2 className={`h-4 w-4 ${index < 3 ? 'text-destructive' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{location.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{location.address}</p>
                        </div>
                      </div>
                      <Badge variant={index < 3 ? "destructive" : "secondary"}>
                        {location.complaints}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Top Issues:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.topCategories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link 
                      href={`/companies/${location.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block mt-4"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Mobile Complaints */}
            <Card className="mt-8 bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Mobile, AL Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Security deposit not returned after 60 days", company: "Maddox Properties LLC", time: "2 hours ago" },
                    { title: "Black mold found in bathroom, management refuses to fix", company: "Plantation Apartments", time: "5 hours ago" },
                    { title: "Security gate broken for 3 months, cars being broken into", company: "Oak Tree Apartments", time: "1 day ago" },
                    { title: "Charged $500 in fake cleaning fees", company: "Plantation Apartments", time: "2 days ago" },
                    { title: "Roach infestation, pest control never comes", company: "Oak Tree Apartments", time: "3 days ago" },
                  ].map((complaint, index) => (
                    <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground">{complaint.company}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{complaint.time}</span>
                    </div>
                  ))}
                </div>
                <Link href="/complaints?state=AL&city=Mobile" className="block mt-4">
                  <Button className="w-full">View All Mobile Complaints</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Nationwide Hot Spots Section */}
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
                <Building2 className="h-6 w-6 text-primary" />
                Complaint Hot Spots - Major US Cities
              </h2>
              <p className="text-muted-foreground">
                See complaint trends from the largest metropolitan areas across the country
              </p>
            </div>

            {/* Cities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {majorCities.map((city, index) => (
                <Card key={city.name} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-base">{city.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{city.topIssue}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">{city.complaints.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Reports</p>
                      </div>
                      <Badge variant={city.complaints > 400 ? "destructive" : "secondary"}>
                        #{index + 1}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                      <Link href={`/complaints?city=${city.name}`}>
                        View Reports
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
