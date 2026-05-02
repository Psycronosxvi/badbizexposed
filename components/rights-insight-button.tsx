"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Scale, 
  Lock, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Sparkles,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

interface RightsInsightButtonProps {
  complaintText: string
  category?: string
  state?: string
  city?: string
}

interface LegalKnowledge {
  id: string
  state_code: string
  state_name: string
  category: string
  title: string
  official_summary: string
  plain_language: string
  key_points: string[]
  helpful_links: { title: string; url: string }[]
}

const categoryMapping: Record<string, string> = {
  'landlord': 'landlord_tenant',
  'tenant': 'landlord_tenant',
  'rental': 'landlord_tenant',
  'apartment': 'landlord_tenant',
  'lease': 'landlord_tenant',
  'eviction': 'landlord_tenant',
  'security deposit': 'landlord_tenant',
  'hoa': 'hoa_rights',
  'homeowner': 'hoa_rights',
  'association': 'hoa_rights',
  'consumer': 'consumer_protection',
  'scam': 'consumer_protection',
  'fraud': 'consumer_protection',
  'refund': 'consumer_protection',
  'warranty': 'consumer_protection',
  'contractor': 'contractor_services',
  'repair': 'contractor_services',
  'construction': 'contractor_services',
}

function detectCategory(text: string, category?: string): string {
  const lowerText = (text + ' ' + (category || '')).toLowerCase()
  
  for (const [keyword, cat] of Object.entries(categoryMapping)) {
    if (lowerText.includes(keyword)) {
      return cat
    }
  }
  
  return 'consumer_protection' // Default fallback
}

export function RightsInsightButton({ 
  complaintText, 
  category, 
  state, 
  city 
}: RightsInsightButtonProps) {
  const { profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [legalInfo, setLegalInfo] = useState<LegalKnowledge[]>([])
  const [detectedCategory, setDetectedCategory] = useState<string>('')
  
  const isPremium = profile?.is_premium === true
  
  // Only show button if state exists
  if (!state || !complaintText) {
    return null
  }

  const handleClick = async () => {
    setIsOpen(true)
    
    if (isPremium && legalInfo.length === 0) {
      await fetchLegalInfo()
    }
  }

  const fetchLegalInfo = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const detected = detectCategory(complaintText, category)
      setDetectedCategory(detected)
      
      // Get state code from state name
      const stateCode = getStateCode(state)
      
      const { data } = await supabase
        .from('legal_knowledge_base')
        .select('*')
        .eq('state_code', stateCode)
      
      if (data) {
        setLegalInfo(data)
      }
    } catch (error) {
      console.error('Error fetching legal info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Run analysis when premium user opens dialog
  useEffect(() => {
    if (isOpen && isPremium && legalInfo.length === 0) {
      fetchLegalInfo()
    }
  }, [isOpen, isPremium])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
        onClick={handleClick}
      >
        <Scale className="h-4 w-4" />
        View Possible Rights Information
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Know Your Rights
            </DialogTitle>
            <DialogDescription>
              Educational information about consumer rights in {state}
            </DialogDescription>
          </DialogHeader>

          {!isPremium ? (
            // Paywall Content
            <div className="py-6">
              <div className="text-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  General rights information available for this type of dispute
                </h3>
                <p className="text-muted-foreground">
                  Based on your complaint location ({city ? `${city}, ` : ''}{state}), 
                  we have found relevant consumer rights information that may help you understand your options.
                </p>
              </div>

              {/* Preview teaser */}
              <Card className="bg-secondary/50 border-primary/20 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">What you&apos;ll get as a member:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          State-specific consumer rights summaries
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          Plain-language explanations of your rights
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          Key points checklist for your situation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          Links to official resources and agencies
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link href="/pricing">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Become a Member to View Details
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
                  Premium members get full access to legal rights information
                </p>
              </div>
            </div>
          ) : (
            // Premium Content
            <div className="py-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Analyzing your complaint...</p>
                </div>
              ) : legalInfo.length > 0 ? (
                <>
                  {/* Detected Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-primary border-primary">
                      {formatCategoryName(detectedCategory)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      This may relate to your complaint
                    </span>
                  </div>

                  {/* Tabs for different categories */}
                  <Tabs defaultValue={detectedCategory || legalInfo[0]?.category}>
                    <TabsList className="w-full justify-start flex-wrap h-auto gap-1 mb-4">
                      {legalInfo.map((info) => (
                        <TabsTrigger 
                          key={info.category} 
                          value={info.category}
                          className="text-xs"
                        >
                          {formatCategoryName(info.category)}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {legalInfo.map((info) => (
                      <TabsContent key={info.category} value={info.category}>
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{info.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Plain Language Explanation */}
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                What This May Mean For You
                              </h4>
                              <p className="text-sm text-foreground">
                                {info.plain_language}
                              </p>
                            </div>

                            {/* Key Points */}
                            {info.key_points && info.key_points.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Key Points to Consider:</h4>
                                <ul className="space-y-2">
                                  {info.key_points.map((point, idx) => (
                                    <li 
                                      key={idx} 
                                      className="flex items-start gap-2 text-sm"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Official Summary */}
                            <details className="group">
                              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                                <Scale className="h-4 w-4" />
                                View Official Legal Summary
                              </summary>
                              <p className="mt-2 text-sm text-muted-foreground pl-6">
                                {info.official_summary}
                              </p>
                            </details>

                            {/* Helpful Links */}
                            {info.helpful_links && info.helpful_links.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Official Resources:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {info.helpful_links.map((link, idx) => (
                                    <a
                                      key={idx}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      {link.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No specific rights information found for {state}. 
                    Check our general consumer guides for more help.
                  </p>
                  <Link href="/guides">
                    <Button variant="outline" className="mt-4">
                      View Consumer Guides
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <DialogFooter className="flex-col sm:flex-col gap-2 border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              This information is for educational purposes only and is not legal advice. 
              For specific legal questions, please consult with a qualified attorney.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    'landlord_tenant': 'Landlord & Tenant',
    'consumer_protection': 'Consumer Protection',
    'hoa_rights': 'HOA Rights',
    'contractor_services': 'Contractor Services',
    'debt_collection': 'Debt Collection',
  }
  return names[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getStateCode(stateName: string): string {
  const states: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
  }
  
  // Check if it's already a code
  if (stateName.length === 2) return stateName.toUpperCase()
  
  return states[stateName] || stateName
}
