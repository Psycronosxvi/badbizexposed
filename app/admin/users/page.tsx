import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { 
  Users, 
  Search,
  Shield,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
  FileText,
  MessageSquare
} from "lucide-react"

interface SearchParams {
  q?: string
  filter?: string
}

async function getUsers(search?: string, filter?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  if (filter === 'admins') {
    query = query.eq('is_admin', true)
  } else if (filter === 'banned') {
    query = query.eq('is_banned', true)
  }

  const { data: users } = await query

  // Get stats
  const { count: totalCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  const { count: adminCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_admin', true)

  const { count: bannedCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_banned', true)

  return {
    users: users || [],
    stats: {
      total: totalCount || 0,
      admins: adminCount || 0,
      banned: bannedCount || 0,
    }
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { users, stats } = await getUsers(params.q, params.filter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-chart-4" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users, roles, and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-chart-4/10">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <Ban className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.banned}</p>
                <p className="text-sm text-muted-foreground">Banned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <form action="/admin/users" method="GET" className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Search users..."
              defaultValue={params.q}
              className="pl-10"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <Button variant={!params.filter ? "default" : "outline"} size="sm">All</Button>
          </Link>
          <Link href="/admin/users?filter=admins">
            <Button variant={params.filter === 'admins' ? "default" : "outline"} size="sm">Admins</Button>
          </Link>
          <Link href="/admin/users?filter=banned">
            <Button variant={params.filter === 'banned' ? "default" : "outline"} size="sm">Banned</Button>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reputation</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Activity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user: {
                  id: string
                  display_name: string | null
                  username: string | null
                  avatar_url: string | null
                  bio: string | null
                  reputation: number
                  is_admin: boolean
                  is_banned?: boolean
                  is_bot: boolean
                  created_at: string
                }) => (
                  <tr key={user.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.display_name || user.username || 'Anonymous'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username || user.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {user.is_admin && (
                          <Badge className="bg-primary/10 text-primary border-primary/30">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.is_bot && (
                          <Badge variant="secondary">Bot</Badge>
                        )}
                        {user.is_banned && (
                          <Badge variant="destructive">
                            <Ban className="h-3 w-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                        {!user.is_admin && !user.is_bot && !user.is_banned && (
                          <Badge variant="outline">User</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium">{user.reputation || 0}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          0
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          0
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!user.is_admin && (
                          <Button variant="ghost" size="sm" className="text-primary">
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}
                        {!user.is_banned ? (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-success">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
