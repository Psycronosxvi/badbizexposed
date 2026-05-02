"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Loader2, Upload, X } from "lucide-react"
import type { Category, State } from "@/lib/types"

interface ComplaintFormProps {
  categories?: Category[]
  states?: State[]
  companies?: { id: string; name: string; slug: string }[]
  preselectedCompany?: string
}

export function ComplaintForm({ 
  categories = [], 
  states = [], 
  companies = [],
  preselectedCompany = ""
}: ComplaintFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Ensure safe arrays to prevent .map errors
  const safeCategories = Array.isArray(categories) ? categories : []
  const safeStates = Array.isArray(states) ? states : []
  const safeCompanies = Array.isArray(companies) ? companies : []
  
  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [existingCompanyId, setExistingCompanyId] = useState(preselectedCompany || "")
  const [categoryId, setCategoryId] = useState("")
  const [stateId, setStateId] = useState("")
  const [city, setCity] = useState("")
  const [severity, setSeverity] = useState([3])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const severityLabels = ['Minor', 'Low', 'Medium', 'High', 'Critical']
  const severityDescriptions = [
    'Minor inconvenience, easily resolved',
    'Some inconvenience, took effort to resolve',
    'Significant issue, ongoing problems',
    'Serious harm, financial loss, or safety concern',
    'Severe harm, major financial loss, or dangerous situation'
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles].slice(0, 5)) // Max 5 files
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    console.log("[v0] Form submission started")
    console.log("[v0] Form data:", { title, content: content.slice(0, 50), companyName, existingCompanyId, categoryId, stateId })

    if (!title.trim()) {
      setError("Please enter a title for your complaint")
      return
    }
    if (!content.trim()) {
      setError("Please describe your complaint")
      return
    }
    if (content.trim().length < 50) {
      setError("Your complaint description must be at least 50 characters long. Please provide more details.")
      return
    }
    if ((!existingCompanyId || existingCompanyId === "new") && !companyName.trim()) {
      setError("Please select or enter a company name")
      return
    }
    if (!categoryId) {
      setError("Please select a category")
      return
    }
    if (!stateId) {
      setError("Please select a state")
      return
    }
    
    console.log("[v0] Validation passed, starting transition")

    startTransition(async () => {
      try {
        const supabase = createClient()
        console.log("[v0] Supabase client created")
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log("[v0] User check:", { user: user?.id, error: userError })
        if (!user) {
          setError("You must be logged in to submit a complaint")
          return
        }

        let companyId = existingCompanyId === "new" ? "" : existingCompanyId

        // Get category name and state name FIRST (needed for business creation)
        const selectedCategory = safeCategories.find(c => c.id === categoryId)
        const selectedState = safeStates.find(s => s.id === stateId)

        // Get business name for complaint
        const businessName = (existingCompanyId && existingCompanyId !== "new")
          ? safeCompanies.find(c => c.id === existingCompanyId)?.name || companyName.trim()
          : companyName.trim()

        // If new company, try to create it (may fail due to RLS - that's ok, we'll just use the name)
        if ((!existingCompanyId || existingCompanyId === "new") && companyName.trim()) {
          const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          
          try {
            const { data: newCompany, error: companyError } = await supabase
              .from('businesses')
              .insert({
                name: companyName.trim(),
                slug: slug + '-' + Date.now().toString(36),
                category: selectedCategory?.name || categoryId,
                city: city.trim() || null,
                state: selectedState?.abbreviation || stateId,
              })
              .select()
              .single()

            if (!companyError && newCompany) {
              companyId = newCompany.id
              console.log("[v0] Created new business:", newCompany.id)
            } else {
              console.log("[v0] Could not create business (RLS), proceeding with name only:", companyError?.message)
            }
          } catch (bizErr) {
            console.log("[v0] Business creation failed, proceeding with name only:", bizErr)
          }
        }

        // Create the complaint
        console.log("[v0] Creating complaint with data:", { 
          title: title.trim(), 
          business_name: businessName, 
          category: selectedCategory?.name || categoryId,
          state: selectedState?.abbreviation || stateId 
        })
        
        const { data: complaint, error: complaintError } = await supabase
          .from('complaints')
          .insert({
            title: title.trim(),
            content: content.trim(),
            business_id: companyId || null,
            business_name: businessName,
            user_id: user.id,
            category: selectedCategory?.name || categoryId,
            city: city.trim() || null,
            state: selectedState?.abbreviation || stateId,
            severity: severity[0],
            is_anonymous: isAnonymous,
            status: 'pending',
          })
          .select()
          .single()

        console.log("[v0] Complaint insert result:", { complaint: complaint?.id, error: complaintError })

        if (complaintError) {
          console.error("[v0] Error creating complaint:", complaintError)
          setError(`Failed to submit complaint: ${complaintError.message}`)
          return
        }

        // Update business complaint count (non-blocking)
        if (companyId) {
          try {
            const { data: business } = await supabase
              .from('businesses')
              .select('complaint_count')
              .eq('id', companyId)
              .single()
            
            if (business) {
              await supabase
                .from('businesses')
                .update({ complaint_count: (business.complaint_count || 0) + 1 })
                .eq('id', companyId)
            }
          } catch (updateErr) {
            console.log("[v0] Business count update failed (non-critical):", updateErr)
          }
        }

        // Award points to user (non-blocking - don't fail if this doesn't work)
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single()
          
          if (profile) {
            await supabase
              .from('profiles')
              .update({ points: (profile.points || 0) + 10 })
              .eq('id', user.id)
          }
          
          // Add to points history (may fail due to RLS, but that's ok)
          await supabase
            .from('points_history')
            .insert({
              user_id: user.id,
              points: 10,
              reason: 'Submitted a complaint',
              reference_type: 'complaint',
              reference_id: complaint.id
            })
        } catch (pointsErr) {
          console.log("[v0] Points update failed (non-critical):", pointsErr)
        }

        // Show success and redirect
        console.log("[v0] Success! Redirecting to complaint:", complaint.id)
        setSuccess(true)
        setTimeout(() => {
          router.push(`/complaints/${complaint.id}`)
        }, 1500)
      } catch (err) {
        console.error("[v0] Unexpected error:", err)
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Complaint Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-3">
              <svg className="h-5 w-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-success font-medium">Your report has been submitted! Redirecting...</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title *</Label>
            <Input
              id="title"
              placeholder="Brief summary of your complaint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
          </div>

          {/* Company Selection */}
          <div className="space-y-2">
            <Label>Company *</Label>
            {safeCompanies.length > 0 && (
              <Select 
                value={existingCompanyId || "new"} 
                onValueChange={(val) => {
                  if (val === "new") {
                    setExistingCompanyId("")
                  } else {
                    setExistingCompanyId(val)
                    setCompanyName("")
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select existing company or enter new below" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">-- Enter new company --</SelectItem>
                  {safeCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {(!existingCompanyId || existingCompanyId === "new") && (
              <Input
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}
          </div>

          {/* Category & Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {safeCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>State *</Label>
              <Select value={stateId} onValueChange={setStateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {safeStates.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="City where incident occurred"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Describe Your Complaint *</Label>
            <Textarea
              id="content"
              placeholder="Provide detailed information about what happened. Include dates, names, and any relevant details that will help others understand your experience."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground">{content.length}/5000 characters</p>
          </div>

          {/* Severity */}
          <div className="space-y-4">
            <Label>Severity Level: {severityLabels[severity[0] - 1]}</Label>
            <Slider
              value={severity}
              onValueChange={setSeverity}
              min={1}
              max={5}
              step={1}
              className="py-2"
            />
            <p className="text-sm text-muted-foreground">
              {severityDescriptions[severity[0] - 1]}
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Evidence (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload photos, documents, or screenshots
              </p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button type="button" variant="outline" size="sm" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Max 5 files, 10MB each
              </p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Post anonymously (your username will be hidden)
            </label>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you confirm that this is a truthful account of your experience 
            and agree to our community guidelines.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
