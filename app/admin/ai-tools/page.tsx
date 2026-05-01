"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Brain, 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  FileWarning,
  Copy,
  RefreshCw
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VerificationResult {
  fake_probability: number
  toxicity_score: number
  duplicate_similarity: number
  summary: string
  recommendation: 'approve' | 'reject' | 'manual_review'
}

interface SearchResult {
  id: string
  title: string
  company_name: string
  similarity: number
  content: string
}

export default function AIToolsPage() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState("distilbert-base-uncased")
  const [aiEnabled, setAiEnabled] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Verification state
  const [complaintId, setComplaintId] = useState("")
  const [complaintText, setComplaintText] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          enabled: aiEnabled,
        }),
      })
      
      if (response.ok) {
        alert('Settings saved successfully')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerifyComplaint = async () => {
    if (!complaintId && !complaintText) return
    
    setIsVerifying(true)
    setVerificationResult(null)
    
    try {
      const response = await fetch('/api/admin/ai/verify-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId,
          complaintText,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setVerificationResult(data)
      }
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setSearchResults([])
    
    try {
      const response = await fetch('/api/admin/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'approve':
        return <Badge className="bg-success/10 text-success"><CheckCircle className="h-3 w-3 mr-1" /> Approve</Badge>
      case 'reject':
        return <Badge className="bg-destructive/10 text-destructive"><XCircle className="h-3 w-3 mr-1" /> Reject</Badge>
      default:
        return <Badge className="bg-warning/10 text-warning"><AlertTriangle className="h-3 w-3 mr-1" /> Manual Review</Badge>
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Tools
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered complaint verification and semantic search
          </p>
        </div>
        <Badge variant={aiEnabled ? "default" : "secondary"}>
          {aiEnabled ? "AI Enabled" : "AI Disabled"}
        </Badge>
      </div>

      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Verification Scanner
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Semantic Search
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Verification Scanner Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileWarning className="h-5 w-5" />
                Complaint Verification Scanner
              </CardTitle>
              <CardDescription>
                Analyze complaints for fake submissions, toxicity, and duplicates using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Complaint ID (optional)</Label>
                  <Input 
                    placeholder="Enter complaint ID to verify..."
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Or paste complaint text directly</Label>
                  <Textarea 
                    placeholder="Paste the complaint text here for verification..."
                    rows={5}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleVerifyComplaint}
                disabled={isVerifying || (!complaintId && !complaintText)}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Run AI Verification
                  </>
                )}
              </Button>

              {/* Verification Results */}
              {verificationResult && (
                <div className="mt-6 p-6 border border-border rounded-lg bg-secondary/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Verification Results</h3>
                    {getRecommendationBadge(verificationResult.recommendation)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Fake Probability</div>
                      <div className={`text-2xl font-bold ${
                        verificationResult.fake_probability > 70 ? 'text-destructive' : 
                        verificationResult.fake_probability > 40 ? 'text-warning' : 'text-success'
                      }`}>
                        {verificationResult.fake_probability}%
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Toxicity Score</div>
                      <div className={`text-2xl font-bold ${
                        verificationResult.toxicity_score > 70 ? 'text-destructive' : 
                        verificationResult.toxicity_score > 40 ? 'text-warning' : 'text-success'
                      }`}>
                        {verificationResult.toxicity_score}%
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Duplicate Similarity</div>
                      <div className={`text-2xl font-bold ${
                        verificationResult.duplicate_similarity > 70 ? 'text-warning' : 'text-success'
                      }`}>
                        {verificationResult.duplicate_similarity}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground mb-2">AI Summary</div>
                    <p className="text-foreground">{verificationResult.summary}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Semantic Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                AI Semantic Database Search
              </CardTitle>
              <CardDescription>
                Search complaints using natural language. Finds similar complaints even with different wording or misspellings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Find complaints about this business even if spelled wrong..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSemanticSearch} disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Examples: &quot;mold issues in apartments&quot;, &quot;security deposit theft&quot;, &quot;management won&apos;t respond&quot;
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="font-semibold">
                    Found {searchResults.length} similar complaints
                  </h3>
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{result.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.company_name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {result.content}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {Math.round(result.similarity * 100)}% match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                HuggingFace API Settings
              </CardTitle>
              <CardDescription>
                Configure your AI integration settings. Your API key is encrypted and stored securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>HuggingFace API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      type={showApiKey ? "text" : "password"}
                      placeholder="hf_xxxxxxxxxxxxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener" className="text-primary hover:underline">huggingface.co/settings/tokens</a>
                </p>
              </div>

              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distilbert-base-uncased">DistilBERT (Fast, General)</SelectItem>
                    <SelectItem value="sentence-transformers/all-MiniLM-L6-v2">MiniLM (Embeddings)</SelectItem>
                    <SelectItem value="facebook/bart-large-mnli">BART (Classification)</SelectItem>
                    <SelectItem value="unitary/toxic-bert">Toxic-BERT (Toxicity Detection)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label>Enable AI Features</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on AI-powered verification and search
                  </p>
                </div>
                <Switch 
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
