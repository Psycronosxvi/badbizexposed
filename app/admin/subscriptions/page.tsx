"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp,
  Search,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"

interface Subscription {
  id: string
  user_id: string
  user_email: string
  user_name: string
  stripe_customer_id: string
  status: string
  plan: string
  amount: number
  start_date: string
  end_date: string
  created_at: string
}

interface PaymentLog {
  id: string
  user_id: string
  stripe_customer_id: string
  amount: number
  currency: string
  status: string
  type: string
  created_at: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    churnRate: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    
    // Fetch profiles with premium status
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, display_name, stripe_customer_id, is_premium, subscription_status, subscription_start_date, subscription_end_date, created_at')
      .eq('is_premium', true)
      .order('subscription_start_date', { ascending: false })

    if (profiles) {
      const subs: Subscription[] = profiles.map(p => ({
        id: p.id,
        user_id: p.id,
        user_email: p.email || '',
        user_name: p.display_name || 'Unknown',
        stripe_customer_id: p.stripe_customer_id || '',
        status: p.subscription_status || 'active',
        plan: 'Premium Monthly',
        amount: 199,
        start_date: p.subscription_start_date || p.created_at,
        end_date: p.subscription_end_date || '',
        created_at: p.created_at,
      }))
      setSubscriptions(subs)
      
      // Calculate stats
      const activeCount = subs.filter(s => s.status === 'active').length
      setStats({
        totalSubscribers: subs.length,
        monthlyRevenue: activeCount * 1.99,
        activeSubscriptions: activeCount,
        churnRate: subs.length > 0 ? ((subs.length - activeCount) / subs.length * 100) : 0,
      })
    }

    // Fetch payment logs
    const { data: logs } = await supabase
      .from('payment_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (logs) {
      setPaymentLogs(logs)
    }

    setIsLoading(false)
  }

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.stripe_customer_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success">Active</Badge>
      case 'canceled':
        return <Badge className="bg-destructive/10 text-destructive">Canceled</Badge>
      case 'past_due':
        return <Badge className="bg-warning/10 text-warning">Past Due</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Subscriptions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage premium subscriptions and view payment history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Stripe Dashboard
            </Button>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold">${stats.monthlyRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-4 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-3xl font-bold">{stats.churnRate.toFixed(1)}%</p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>View and manage subscriber accounts</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sub.user_name}</p>
                        <p className="text-sm text-muted-foreground">{sub.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(sub.start_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading...' : 'No subscriptions found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Payment history and transaction logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentLogs.length > 0 ? (
                paymentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.type?.replace('_', ' ')}</TableCell>
                    <TableCell>${((log.amount || 0) / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={log.status === 'succeeded' || log.status === 'completed' ? 'default' : 'secondary'}
                        className={log.status === 'succeeded' || log.status === 'completed' ? 'bg-success/10 text-success' : ''}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No payment logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
