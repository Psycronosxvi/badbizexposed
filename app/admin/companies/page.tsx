"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building2, 
  Search, 
  MoreHorizontal, 
  Eye,
  Edit,
  Merge,
  Flag,
  CheckCircle,
  AlertTriangle,
  Archive,
  ExternalLink,
  Star,
  MessageSquare
} from "lucide-react"

type Company = {
  id: string
  name: string
  slug: string
  category: string | null
  description: string | null
  website: string | null
  status: string
  is_claimed: boolean
  created_at: string
  complaint_count?: number
  avg_rating?: number
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  disputed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  flagged: "bg-red-500/20 text-red-400 border-red-500/30",
  archived: "bg-muted text-muted-foreground border-muted",
}

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="h-3 w-3" />,
  disputed: <AlertTriangle className="h-3 w-3" />,
  resolved: <CheckCircle className="h-3 w-3" />,
  flagged: <Flag className="h-3 w-3" />,
  archived: <Archive className="h-3 w-3" />,
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editDialog, setEditDialog] = useState(false)
  const [mergeDialog, setMergeDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [mergeTarget, setMergeTarget] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    fetchCompanies()
  }, [statusFilter])

  async function fetchCompanies() {
    setLoading(true)
    let query = supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false })

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    const { data, error } = await query

    if (!error && data) {
      setCompanies(data)
    }
    setLoading(false)
  }

  async function updateCompanyStatus(companyId: string, status: string) {
    const { error } = await supabase
      .from("businesses")
      .update({ status })
      .eq("id", companyId)

    if (!error) {
      // Log admin action
      await logAdminAction("update_company_status", companyId, { status })
      fetchCompanies()
    }
  }

  async function logAdminAction(action: string, targetId: string, details: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action,
        target_type: "company",
        target_id: targetId,
        details,
      })
    }
  }

  async function saveCompanyEdit() {
    if (!selectedCompany) return

    const { error } = await supabase
      .from("businesses")
      .update({
        name: selectedCompany.name,
        category: selectedCompany.category,
        description: selectedCompany.description,
        website: selectedCompany.website,
        status: selectedCompany.status,
      })
      .eq("id", selectedCompany.id)

    if (!error) {
      await logAdminAction("edit_company", selectedCompany.id, { 
        name: selectedCompany.name,
        category: selectedCompany.category,
        status: selectedCompany.status,
      })
      setEditDialog(false)
      fetchCompanies()
    }
  }

  async function mergeCompanies() {
    if (!selectedCompany || !mergeTarget) return

    // Update all complaints from source to target
    await supabase
      .from("complaints")
      .update({ business_id: mergeTarget })
      .eq("business_id", selectedCompany.id)

    // Archive the source company
    await supabase
      .from("businesses")
      .update({ status: "archived" })
      .eq("id", selectedCompany.id)

    await logAdminAction("merge_companies", selectedCompany.id, { 
      merged_into: mergeTarget 
    })

    setMergeDialog(false)
    setMergeTarget("")
    fetchCompanies()
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Company Management</h1>
          <p className="text-muted-foreground">Manage business listings and statuses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {["active", "disputed", "resolved", "flagged", "archived"].map((status) => (
          <Card key={status} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                  <p className="text-2xl font-bold">
                    {companies.filter(c => c.status === status).length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${statusColors[status]}`}>
                  {statusIcons[status]}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Companies ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Claimed</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        {company.website && (
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {company.website}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{company.category || "Uncategorized"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[company.status] || statusColors.active}>
                        <span className="flex items-center gap-1">
                          {statusIcons[company.status]}
                          {company.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {company.is_claimed ? (
                        <Badge className="bg-accent/20 text-accent border-accent/30">Claimed</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unclaimed</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(company.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`/company/${company.slug}`, "_blank")}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Page
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedCompany(company)
                            setEditDialog(true)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedCompany(company)
                            setMergeDialog(true)
                          }}>
                            <Merge className="h-4 w-4 mr-2" />
                            Merge Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateCompanyStatus(company.id, "active")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateCompanyStatus(company.id, "disputed")}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Mark Disputed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateCompanyStatus(company.id, "flagged")}>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag for Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateCompanyStatus(company.id, "archived")}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={selectedCompany.name}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={selectedCompany.category || ""}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, category: e.target.value })}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={selectedCompany.website || ""}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, website: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedCompany.description || ""}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={selectedCompany.status} 
                  onValueChange={(value) => setSelectedCompany({ ...selectedCompany, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={saveCompanyEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={mergeDialog} onOpenChange={setMergeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Merge <strong>{selectedCompany?.name}</strong> into another company. 
              All complaints will be transferred and this company will be archived.
            </p>
            <div>
              <Label>Target Company</Label>
              <Select value={mergeTarget} onValueChange={setMergeTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target company" />
                </SelectTrigger>
                <SelectContent>
                  {companies
                    .filter(c => c.id !== selectedCompany?.id && c.status !== "archived")
                    .map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialog(false)}>Cancel</Button>
            <Button onClick={mergeCompanies} disabled={!mergeTarget}>Merge Companies</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
