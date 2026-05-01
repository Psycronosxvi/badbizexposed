import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simulated semantic search (replace with actual embeddings in production)
// In production, this would use HuggingFace embeddings + pgvector
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const textWords = text.toLowerCase().split(/\s+/)
  
  let matches = 0
  for (const word of queryWords) {
    // Check for partial matches (handles misspellings)
    for (const textWord of textWords) {
      if (textWord.includes(word) || word.includes(textWord)) {
        matches++
        break
      }
      // Levenshtein-like check for similar words
      if (word.length > 3 && textWord.length > 3) {
        let diff = 0
        const minLen = Math.min(word.length, textWord.length)
        for (let i = 0; i < minLen; i++) {
          if (word[i] !== textWord[i]) diff++
        }
        if (diff <= 2) {
          matches += 0.5
          break
        }
      }
    }
  }
  
  return Math.min(1, matches / queryWords.length)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
  
  try {
    const { query } = await request.json()
    
    if (!query || query.trim().length < 3) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 })
    }
    
    // Fetch recent complaints for semantic search
    const { data: complaints } = await supabase
      .from('complaints')
      .select('id, title, content, company_name')
      .order('created_at', { ascending: false })
      .limit(500)
    
    if (!complaints || complaints.length === 0) {
      return NextResponse.json({ results: [] })
    }
    
    // Calculate similarity scores
    const results = complaints
      .map(complaint => {
        const fullText = `${complaint.title} ${complaint.content} ${complaint.company_name}`
        const similarity = calculateSimilarity(query, fullText)
        return {
          id: complaint.id,
          title: complaint.title,
          company_name: complaint.company_name,
          content: complaint.content?.substring(0, 200) + '...',
          similarity,
        }
      })
      .filter(r => r.similarity > 0.2)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
    
    // Log the search action
    await supabase.from('admin_action_logs').insert({
      admin_id: user.id,
      action_type: 'ai_semantic_search',
      details: { query, results_count: results.length },
    })
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Semantic search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
