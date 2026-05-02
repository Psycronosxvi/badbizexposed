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
    const { complaint_id, comment_id, reason, details } = body

    // Validation
    if (!complaint_id && !comment_id) {
      return NextResponse.json({ error: "Must specify complaint_id or comment_id" }, { status: 400 })
    }
    if (!reason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 })
    }

    const validReasons = [
      'spam',
      'harassment',
      'false_information',
      'illegal_content',
      'doxxing',
      'off_topic',
      'other'
    ]

    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 })
    }

    // Check for duplicate report
    const { data: existingReport } = await supabase
      .from('abuse_reports')
      .select('id')
      .eq('reporter_id', user.id)
      .eq(complaint_id ? 'complaint_id' : 'comment_id', complaint_id || comment_id)
      .single()

    if (existingReport) {
      return NextResponse.json({ 
        error: "You have already reported this content" 
      }, { status: 400 })
    }

    // Create report
    const { data: report, error } = await supabase
      .from('abuse_reports')
      .insert({
        reporter_id: user.id,
        complaint_id: complaint_id || null,
        comment_id: comment_id || null,
        reason,
        details: details?.substring(0, 1000) || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      message: "Report submitted successfully",
      report_id: report.id 
    })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
