import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simulated AI verification (replace with actual HuggingFace API calls)
async function analyzeComplaint(text: string) {
  // In production, this would call HuggingFace APIs
  // For now, we simulate the analysis
  
  // Fake detection heuristics
  const shortText = text.length < 100
  const hasExcessiveCaps = (text.match(/[A-Z]/g) || []).length / text.length > 0.3
  const hasRepeatedChars = /(.)\1{4,}/.test(text)
  const hasGenericPhrases = /terrible|worst ever|scam|rip off|avoid at all costs/i.test(text)
  
  let fakeProbability = 10
  if (shortText) fakeProbability += 20
  if (hasExcessiveCaps) fakeProbability += 25
  if (hasRepeatedChars) fakeProbability += 30
  if (hasGenericPhrases) fakeProbability += 15
  
  // Toxicity detection heuristics
  const toxicWords = /hate|stupid|idiot|dumb|fool|moron|kill|die|threat/i
  const toxicityScore = toxicWords.test(text) ? 60 + Math.random() * 30 : Math.random() * 30
  
  // Duplicate similarity (would use embeddings in production)
  const duplicateSimilarity = Math.random() * 40
  
  // Determine recommendation
  let recommendation: 'approve' | 'reject' | 'manual_review'
  if (fakeProbability > 70 || toxicityScore > 80) {
    recommendation = 'reject'
  } else if (fakeProbability > 40 || toxicityScore > 50 || duplicateSimilarity > 70) {
    recommendation = 'manual_review'
  } else {
    recommendation = 'approve'
  }
  
  // Generate summary
  const issues: string[] = []
  if (fakeProbability > 40) issues.push('potentially fake content')
  if (toxicityScore > 50) issues.push('contains toxic language')
  if (duplicateSimilarity > 70) issues.push('similar to existing complaints')
  if (shortText) issues.push('very short complaint')
  
  const summary = issues.length > 0 
    ? `This complaint has been flagged for: ${issues.join(', ')}. Recommendation: ${recommendation.replace('_', ' ')}.`
    : 'This complaint appears legitimate and appropriate for publication.'
  
  return {
    fake_probability: Math.min(100, Math.round(fakeProbability)),
    toxicity_score: Math.round(toxicityScore),
    duplicate_similarity: Math.round(duplicateSimilarity),
    summary,
    recommendation,
  }
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
    const { complaintId, complaintText } = await request.json()
    
    let textToAnalyze = complaintText
    
    // If complaintId provided, fetch the complaint text
    if (complaintId && !complaintText) {
      const { data: complaint } = await supabase
        .from('complaints')
        .select('content, title')
        .eq('id', complaintId)
        .single()
      
      if (!complaint) {
        return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
      }
      
      textToAnalyze = `${complaint.title}\n\n${complaint.content}`
    }
    
    if (!textToAnalyze) {
      return NextResponse.json({ error: 'No text to analyze' }, { status: 400 })
    }
    
    const result = await analyzeComplaint(textToAnalyze)
    
    // Log the verification action
    await supabase.from('admin_action_logs').insert({
      admin_id: user.id,
      action_type: 'ai_verification',
      target_id: complaintId || null,
      details: { result, text_length: textToAnalyze.length },
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
