"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertTriangle,
  Star,
  Search,
  Filter,
  TrendingDown,
  Shield,
  AlertCircle,
  BarChart3,
  Building2,
  FileWarning,
  Scale,
  Bug,
  Wrench,
  Users,
  DollarSign,
  Home,
  Volume2,
  FileText,
  Plus,
  Download,
  RefreshCw,
} from "lucide-react"
import { mockReviews, mockCompanies, complaintCategories, reviewSources, severityLevels } from "@/lib/mock-data"

// Get priority tracking companies
const priorityCompanies = mockCompanies.filter(c => c.is_priority_tracking)

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Maintenance Issues": <Wrench className="h-4 w-4" />,
  "Pest Problems": <Bug className="h-4 w-4" />,
  "Safety/Crime Concerns": <Shield className="h-4 w-4" />,
  "Staff/Management Behavior": <Users className="h-4 w-4" />,
  "Billing/Hidden Fees": <DollarSign className="h-4 w-4" />,
  "Property Condition": <Home className="h-4 w-4" />,
  "Noise/Neighbors": <Volume2 className="h-4 w-4" />,
  "Lease/Contract Issues": <FileText className="h-4 w-4" />,
}

export default function ReviewTrackingPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return mockReviews.filter(review => {
      const matchesCompany = selectedCompany === "all" || review.company_id === selectedCompany
      const matchesSeverity = selectedSeverity === "all" || review.severity_level === selectedSeverity
      const matchesCategory = selectedCategory === "all" || review.complaint_categories.includes(selectedCategory)
      const matchesSearch = searchQuery === "" || 
        review.full_review_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCompany && matchesSeverity && matchesCategory && matchesSearch
    })
  }, [selectedCompany, selectedSeverity, selectedCategory, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    const totalReviews = mockReviews.length
    const criticalReviews = mockReviews.filter(r => r.severity_level === "Critical").length
    const legalRiskReviews = mockReviews.filter(r => r.legal_risk_flag).length
    const repeatIssues = mockReviews.filter(r => r.repeat_issue_flag).length
    
    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    mockReviews.forEach(review => {
      review.complaint_categories.forEach(cat => {
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1
      })
    })
    
    // Company breakdown
    const companyBreakdown = priorityCompanies.map(company => ({
      ...company,
      reviews: mockReviews.filter(r => r.company_id === company.id).length,
      criticalCount: mockReviews.filter(r => r.company_id === company.id && r.severity_level === "Critical").length,
    }))
    
    return {
      totalReviews,
      criticalReviews,
      legalRiskReviews,
      repeatIssues,
      categoryBreakdown,
      companyBreakdown,
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-destructive text-destructive-foreground"
      case "High": return "bg-orange-500 text-white"
      case "Moderate": return "bg-yellow-500 text-black"
      case "Low": return "bg-green-500 text-white"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStarColor = (rating: number) => {
    if (rating <= 2) return "text-destructive"
    if (rating <= 3) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-destructive" />
            Review Tracking Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor negative reviews and complaints for priority properties
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Reviews
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalReviews}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive">Critical Issues</p>
                <p className="text-3xl font-bold text-destructive">{stats.criticalReviews}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500">Legal Risk</p>
                <p className="text-3xl font-bold text-orange-500">{stats.legalRiskReviews}</p>
              </div>
              <Scale className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Repeat Issues</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.repeatIssues}</p>
              </div>
              <FileWarning className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="properties">By Property</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {/* Filters */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {priorityCompanies.map(company => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    {severityLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {complaintCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map(review => (
                    <TableRow key={review.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{review.company_name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {review.full_review_text.substring(0, 80)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{review.review_source}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${getStarColor(review.star_rating)}`}>
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium">{review.star_rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {review.complaint_categories.slice(0, 2).map(cat => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                          {review.complaint_categories.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{review.complaint_categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(review.severity_level)}>
                          {review.severity_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {review.repeat_issue_flag && (
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                              Repeat
                            </Badge>
                          )}
                          {review.legal_risk_flag && (
                            <Badge variant="outline" className="text-destructive border-destructive">
                              Legal
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(review.review_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {stats.companyBreakdown.map(company => (
              <Card key={company.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    {company.name}
                  </CardTitle>
                  <CardDescription>{company.city}, {company.state}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Reviews</span>
                    <span className="font-bold">{company.reviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Critical Issues</span>
                    <span className="font-bold text-destructive">{company.criticalCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Rating</span>
                    <div className="flex items-center gap-1 text-destructive">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{company.avg_rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Complaints</span>
                    <span className="font-bold">{company.complaint_count}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Complaint Categories Distribution</CardTitle>
              <CardDescription>Most common issues across all tracked properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-[200px]">
                        {categoryIcons[category]}
                        <span className="text-sm">{category}</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-4">
                        <div 
                          className="bg-primary h-4 rounded-full transition-all"
                          style={{ width: `${(count / mockReviews.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-destructive/5 border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  High-Risk Patterns Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-background rounded-lg border border-destructive/30">
                  <p className="font-medium text-foreground">Mold/Health Issues</p>
                  <p className="text-sm text-muted-foreground">
                    Multiple properties report mold issues being painted over instead of remediated. 
                    Potential health hazard and legal liability.
                  </p>
                </div>
                <div className="p-3 bg-background rounded-lg border border-destructive/30">
                  <p className="font-medium text-foreground">Security Deposit Retention</p>
                  <p className="text-sm text-muted-foreground">
                    Pattern of questionable deposit retention across Maddox Properties LLC. 
                    May violate Alabama tenant protection laws.
                  </p>
                </div>
                <div className="p-3 bg-background rounded-lg border border-destructive/30">
                  <p className="font-medium text-foreground">Safety Concerns</p>
                  <p className="text-sm text-muted-foreground">
                    Broken security gates and lack of cameras reported at Oak Tree Apartments. 
                    Multiple car break-ins documented.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Summary Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span>Average Star Rating</span>
                  <div className="flex items-center gap-1 text-destructive">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">1.3</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span>Reviews with Legal Risk</span>
                  <span className="font-bold text-orange-500">
                    {Math.round((stats.legalRiskReviews / stats.totalReviews) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span>Repeat Issue Rate</span>
                  <span className="font-bold text-yellow-600">
                    {Math.round((stats.repeatIssues / stats.totalReviews) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span>Most Common Issue</span>
                  <span className="font-bold">Maintenance</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Properties Tracked</span>
                  <span className="font-bold">{priorityCompanies.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
