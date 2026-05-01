import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { complaint_id, vote_type } = body

    if (!complaint_id || !vote_type || !['up', 'down'].includes(vote_type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Check for existing vote
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('complaint_id', complaint_id)
      .single()

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Remove vote (toggle off)
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id)

        // Update complaint count
        const field = vote_type === 'up' ? 'upvotes' : 'downvotes'
        await supabase.rpc('decrement_vote', { 
          complaint_id, 
          vote_field: field 
        })

        return NextResponse.json({ action: 'removed', vote_type: null })
      } else {
        // Change vote
        await supabase
          .from('votes')
          .update({ vote_type })
          .eq('id', existingVote.id)

        // Update complaint counts
        const oldField = existingVote.vote_type === 'up' ? 'upvotes' : 'downvotes'
        const newField = vote_type === 'up' ? 'upvotes' : 'downvotes'
        
        await supabase.rpc('change_vote', { 
          complaint_id, 
          old_field: oldField,
          new_field: newField 
        })

        return NextResponse.json({ action: 'changed', vote_type })
      }
    } else {
      // New vote
      await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          complaint_id,
          vote_type,
        })

      // Update complaint count
      const field = vote_type === 'up' ? 'upvotes' : 'downvotes'
      await supabase.rpc('increment_vote', { 
        complaint_id, 
        vote_field: field 
      })

      return NextResponse.json({ action: 'added', vote_type })
    }
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
