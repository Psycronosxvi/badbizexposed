"use client"

import { useState, useEffect } from "react"
import { getStateRights, type StateRightsCategory } from "@/lib/state-rights-data"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Scale, Home, ShieldCheck, Building2, ExternalLink, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react"

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

const CATEGORIES = [
  { id: "landlord_tenant", label: "Landlord & Tenant", icon: Home },
  { id: "consumer_protection", label: "Consumer Protection", icon: ShieldCheck },
  { id: "hoa_rights", label: "HOA Rights", icon: Building2 },
]

// Using StateRightsCategory type from lib/state-rights-data.ts

export default function YourRightsPage() {
  const [selectedState, setSelectedState] = useState<string>("")
  const [legalData, setLegalData] = useState<StateRightsCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [usePlainLanguage, setUsePlainLanguage] = useState(true)

  useEffect(() => {
    if (selectedState) {
      // Use local data instead of database
      setLoading(true)
      const data = getStateRights(selectedState)
      setLegalData(data)
      setLoading(false)
    }
  }, [selectedState])

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return cat ? cat.icon : Scale
  }

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return cat ? cat.label : category
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderWrapper />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Know Your Rights</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Understanding your legal rights is the first step to protecting yourself. 
                Select your state to see consumer protection laws, tenant rights, and more 
                explained in plain language.
              </p>
              
              {/* State Selector */}
              <div className="max-w-md mx-auto">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Information Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!selectedState ? (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Select Your State</h2>
                <p className="text-muted-foreground">
                  Choose your state above to view relevant consumer protection laws, 
                  tenant rights, HOA regulations, and more.
                </p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : legalData.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
                  <AlertTriangle className="h-10 w-10 text-amber-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Information Being Updated</h2>
                <p className="text-muted-foreground mb-6">
                  Information for {US_STATES.find(s => s.code === selectedState)?.name} is currently being updated.
                  Please check back soon.
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {/* Language Toggle */}
                <div className="flex items-center justify-between mb-8 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {US_STATES.find(s => s.code === selectedState)?.name} Legal Rights
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(legalData[0]?.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="language-toggle" className="text-sm">
                      {usePlainLanguage ? "Plain Language" : "Official Language"}
                    </Label>
                    <Switch
                      id="language-toggle"
                      checked={usePlainLanguage}
                      onCheckedChange={setUsePlainLanguage}
                    />
                  </div>
                </div>

                {/* Legal Categories */}
                <Tabs defaultValue={legalData[0]?.category} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                    {legalData.map((item) => {
                      const Icon = getCategoryIcon(item.category)
                      return (
                        <TabsTrigger 
                          key={item.category} 
                          value={item.category}
                          className="flex items-center gap-2 py-3"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{getCategoryLabel(item.category)}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  {legalData.map((item) => (
                    <TabsContent key={item.category} value={item.category} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-2xl">{item.title}</CardTitle>
                              <CardDescription className="mt-2">
                                {getCategoryLabel(item.category)} in {item.state_name}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              {item.state_code}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Summary */}
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              {usePlainLanguage ? "In Plain Terms" : "Official Summary"}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {usePlainLanguage ? item.plain_language : item.official_summary}
                            </p>
                          </div>

                          {/* Key Points */}
                          {item.key_points && item.key_points.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3">Key Points to Remember</h3>
                              <ul className="space-y-2">
                                {item.key_points.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Helpful Links */}
                          {item.helpful_links && item.helpful_links.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3">Helpful Resources</h3>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {item.helpful_links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-sm font-medium truncate">{link.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Disclaimer */}
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-semibold mb-1">Legal Disclaimer</p>
                            <p>
                              This information is provided for educational purposes only and does not 
                              constitute legal advice. Laws change frequently, and local ordinances may 
                              provide additional protections. For specific legal questions, please consult 
                              with a licensed attorney in your state.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How often is this information updated?</AccordionTrigger>
                  <AccordionContent>
                    We strive to update our legal information quarterly and whenever significant 
                    legislative changes occur. Each entry shows the last updated date, and we 
                    recommend verifying current laws with official state sources for time-sensitive matters.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I use this information in court?</AccordionTrigger>
                  <AccordionContent>
                    This information is for educational purposes and general guidance. While we 
                    provide citations to official sources, you should always verify current laws 
                    and consult with a licensed attorney before taking legal action.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What if my state is not listed?</AccordionTrigger>
                  <AccordionContent>
                    We are continuously expanding our coverage. If your state is not yet available, 
                    check back soon or contact us to request priority coverage. In the meantime, 
                    you can check your state attorney general&apos;s website for consumer protection information.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do local laws override state laws?</AccordionTrigger>
                  <AccordionContent>
                    In many cases, local ordinances can provide additional protections beyond state law. 
                    For example, many cities have rent control or additional tenant protections that 
                    exceed state minimums. Always check both state and local regulations.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
