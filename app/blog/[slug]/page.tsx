import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, Share2, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    return { title: 'Post Not Found | BadBizExposed' }
  }

  return {
    title: `${post.title} | BadBizExposed Blog`,
    description: post.excerpt || post.title
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Headers
        if (paragraph.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>
        }
        // Lists
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(line => line.startsWith('- '))
          return (
            <ul key={index} className="list-disc list-inside space-y-1 my-4">
              {items.map((item, i) => (
                <li key={i} className="text-muted-foreground">{item.slice(2)}</li>
              ))}
            </ul>
          )
        }
        // Regular paragraphs
        return <p key={index} className="text-muted-foreground leading-relaxed my-4">{paragraph}</p>
      })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <article className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
          {/* Back Link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-4">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.published_at 
                  ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
                  : 'Recently'
                }
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(post.view_count || 0) + 1} views
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="aspect-video bg-secondary rounded-lg overflow-hidden mb-8">
              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Found this helpful? Share it!</p>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
