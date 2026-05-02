import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const { apiKey, model, enabled } = await request.json()
    
    // Store encrypted settings (in production, encrypt the API key)
    // For now, we store in a settings table or use environment variables
    const { error } = await supabase
      .from('api_key_vault')
      .upsert({
        key_name: 'huggingface_api_key',
        key_value: apiKey, // In production: encrypt this
        metadata: { model, enabled },
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key_name' })
    
    if (error) {
      console.error('Failed to save settings:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
    
    // Log the action
    await supabase.from('admin_action_logs').insert({
      admin_id: user.id,
      action_type: 'ai_settings_update',
      details: { model, enabled, key_updated: !!apiKey },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings save error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

export async function GET(request: Request) {
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
    const { data: settings } = await supabase
      .from('api_key_vault')
      .select('metadata, updated_at')
      .eq('key_name', 'huggingface_api_key')
      .single()
    
    return NextResponse.json({
      hasApiKey: !!settings,
      model: settings?.metadata?.model || 'distilbert-base-uncased',
      enabled: settings?.metadata?.enabled || false,
      updatedAt: settings?.updated_at,
    })
  } catch (error) {
    return NextResponse.json({
      hasApiKey: false,
      model: 'distilbert-base-uncased',
      enabled: false,
    })
  }
}
