import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { 
  BookOpen, 
  Search,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Calendar,
  Tag,
  ExternalLink,
  Star
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SearchParams {
  q?: string
  filter?: string
  category?: string
}

async function getBlogPosts(search?: string, filter?: string, category?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  if (filter === 'published') {
    query = query.eq('is_published', true)
  } else if (filter === 'draft') {
    query = query.eq('is_published', false)
  } else if (filter === 'sponsored') {
    query = query.eq('is_sponsored', true)
  }

  if (category) {
    query = query.eq('category', category)
  }

  const { data: posts } = await query

  // Get stats
  const { count: totalCount } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })

  const { count: publishedCount } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true)

  const { count: sponsoredCount } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('is_sponsored', true)

  // Get unique categories
  const { data: allPosts } = await supabase
    .from('blog_posts')
    .select('category')
  const categories = [...new Set(allPosts?.map(p => p.category).filter(Boolean))]

  return {
    posts: posts || [],
    stats: {
      total: totalCount || 0,
      published: publishedCount || 0,
      sponsored: sponsoredCount || 0,
    },
    categories
  }
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { posts, stats, categories } = await getBlogPosts(params.q, params.filter, params.category)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Blog Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage blog posts and sponsored content
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <Eye className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sponsored}</p>
                <p className="text-sm text-muted-foreground">Sponsored</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <form action="/admin/blog" method="GET" className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Search blog posts..."
              defaultValue={params.q}
              className="pl-10"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <Link href="/admin/blog">
            <Button variant={!params.filter ? "default" : "outline"} size="sm">All</Button>
          </Link>
          <Link href="/admin/blog?filter=published">
            <Button variant={params.filter === 'published' ? "default" : "outline"} size="sm">Published</Button>
          </Link>
          <Link href="/admin/blog?filter=draft">
            <Button variant={params.filter === 'draft' ? "default" : "outline"} size="sm">Drafts</Button>
          </Link>
          <Link href="/admin/blog?filter=sponsored">
            <Button variant={params.filter === 'sponsored' ? "default" : "outline"} size="sm">Sponsored</Button>
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Category:</span>
          <Link href="/admin/blog">
            <Badge variant={!params.category ? "default" : "outline"} className="cursor-pointer">
              All
            </Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/admin/blog?category=${encodeURIComponent(cat)}`}>
              <Badge 
                variant={params.category === cat ? "default" : "outline"} 
                className="cursor-pointer"
              >
                {cat}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Posts Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Post</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Sponsor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Published</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post: {
                  id: string
                  slug: string
                  title: string
                  excerpt: string | null
                  category: string | null
                  tags: string[] | null
                  is_published: boolean
                  is_sponsored: boolean
                  sponsor_name: string | null
                  sponsor_url: string | null
                  view_count: number | null
                  published_at: string | null
                  created_at: string
                }) => (
                  <tr key={post.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-4">
                      <div className="max-w-md">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="font-medium text-foreground hover:text-primary flex items-center gap-1"
                          target="_blank"
                        >
                          {post.title}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {post.category ? (
                        <Badge variant="secondary">{post.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {post.is_published ? (
                        <Badge className="bg-success/10 text-success border-success/30">
                          <Eye className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {post.is_sponsored && post.sponsor_name ? (
                        <Link 
                          href={post.sponsor_url || '#'} 
                          target="_blank"
                          className="text-accent hover:underline text-sm"
                        >
                          {post.sponsor_name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {post.view_count || 0}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {post.published_at 
                        ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
                        : '-'
                      }
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No blog posts found</p>
                <Link href="/admin/blog/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sponsor Info */}
      <Card className="mt-8 bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Star className="h-5 w-5" />
            Sponsored Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            All blog posts are currently sponsored by <strong className="text-accent">Exodia Corporation</strong>. 
            Sponsored posts help support our consumer advocacy mission while providing valuable educational content.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-2xl font-bold text-foreground">{stats.sponsored}</p>
              <p className="text-sm text-muted-foreground">Sponsored Posts</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">Exodia Corp</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-2xl font-bold text-foreground">Active</p>
              <p className="text-sm text-muted-foreground">Partnership Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
