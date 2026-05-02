import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Rate limiting: max 10 comments per minute per user
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 })
    return true
  }
  
  if (userLimit.count >= 10) {
    return false
  }
  
  userLimit.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const complaint_id = searchParams.get('complaint_id')

    if (!complaint_id) {
      return NextResponse.json({ error: "Missing complaint_id" }, { status: 400 })
    }

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(id, display_name, username, avatar_url)
      `)
      .eq('complaint_id', complaint_id)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(comments || [])
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit check
    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please wait before posting again." 
      }, { status: 429 })
    }

    const body = await request.json()
    const { complaint_id, content, parent_id } = body

    // Validation
    if (!complaint_id) {
      return NextResponse.json({ error: "Missing complaint_id" }, { status: 400 })
    }
    if (!content || content.trim().length < 5) {
      return NextResponse.json({ error: "Comment must be at least 5 characters" }, { status: 400 })
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: "Comment cannot exceed 2000 characters" }, { status: 400 })
    }

    // Sanitize content (basic XSS prevention)
    const sanitizedContent = content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim()

    // Create comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        complaint_id,
        user_id: user.id,
        content: sanitizedContent,
        parent_id: parent_id || null,
      })
      .select(`
        *,
        user:profiles(id, display_name, username, avatar_url)
      `)
      .single()

    if (error) throw error

    // Update complaint comment count
    await supabase.rpc('increment_comment_count', { complaint_id })

    // Log activity
    await supabase.from('activity_feed').insert({
      activity_type: 'comment',
      user_id: user.id,
      complaint_id,
      comment_id: comment.id,
      message: `New comment: "${sanitizedContent.substring(0, 50)}..."`,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Post comment error:', error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
