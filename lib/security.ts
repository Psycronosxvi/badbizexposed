import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type SecurityEventType = 
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | 'account_created'
  | 'user_flagged'
  | 'user_unflagged'
  | 'user_banned'
  | 'user_unbanned'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'admin_action'

export type SecurityEventCategory = 'auth' | 'admin' | 'system' | 'fraud'

interface LogSecurityEventParams {
  userId?: string
  eventType: SecurityEventType
  eventCategory?: SecurityEventCategory
  metadata?: Record<string, unknown>
  isSuspicious?: boolean
  riskScore?: number
}

/**
 * Parse user agent string to extract device, browser, and OS info
 */
function parseUserAgent(userAgent: string | null): {
  deviceType: string
  browser: string
  os: string
} {
  if (!userAgent) {
    return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' }
  }

  // Detect device type
  let deviceType = 'desktop'
  if (/mobile/i.test(userAgent)) {
    deviceType = 'mobile'
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet'
  }

  // Detect browser
  let browser = 'unknown'
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    browser = 'Chrome'
  } else if (/firefox/i.test(userAgent)) {
    browser = 'Firefox'
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'Safari'
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge'
  } else if (/opera|opr/i.test(userAgent)) {
    browser = 'Opera'
  }

  // Detect OS
  let os = 'unknown'
  if (/windows/i.test(userAgent)) {
    os = 'Windows'
  } else if (/macintosh|mac os/i.test(userAgent)) {
    os = 'macOS'
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux'
  } else if (/android/i.test(userAgent)) {
    os = 'Android'
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'iOS'
  }

  return { deviceType, browser, os }
}

/**
 * Log a security event to the database
 * This should be called on authentication events and suspicious activities
 */
export async function logSecurityEvent({
  userId,
  eventType,
  eventCategory = 'auth',
  metadata = {},
  isSuspicious = false,
  riskScore = 0,
}: LogSecurityEventParams): Promise<void> {
  try {
    const supabase = await createClient()
    const headersList = await headers()
    
    const userAgent = headersList.get('user-agent')
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    const { deviceType, browser, os } = parseUserAgent(userAgent)

    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: eventType,
      event_category: eventCategory,
      ip_address: ipAddress,
      user_agent: userAgent,
      device_type: deviceType,
      browser,
      os,
      is_suspicious: isSuspicious,
      risk_score: riskScore,
      metadata,
    })

    // Update user profile for login events
    if (userId) {
      if (eventType === 'login') {
        await supabase
          .from('profiles')
          .update({
            last_login_at: new Date().toISOString(),
            last_ip_address: ipAddress,
            login_count: supabase.rpc ? undefined : 1, // Will be incremented by trigger if available
          })
          .eq('id', userId)
      } else if (eventType === 'login_failed') {
        // Increment failed login count
        const { data: profile } = await supabase
          .from('profiles')
          .select('failed_login_count')
          .eq('id', userId)
          .single()

        const newCount = (profile?.failed_login_count || 0) + 1
        
        // Flag user if too many failed attempts
        const updates: Record<string, unknown> = {
          failed_login_count: newCount,
          last_failed_login_at: new Date().toISOString(),
        }

        if (newCount >= 5) {
          updates.security_status = 'SUSPICIOUS'
          updates.suspicious_activity_count = (profile as Record<string, number>)?.suspicious_activity_count || 0 + 1
        }

        await supabase.from('profiles').update(updates).eq('id', userId)
      }
    }
  } catch (error) {
    // Don't throw - logging should not break the app flow
    console.error('[Security] Failed to log security event:', error)
  }
}

/**
 * Calculate and update user trust score based on their activity
 */
export async function updateTrustScore(userId: string): Promise<number> {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!profile) return 50

  let score = 50 // Base score

  // Email verification (+15)
  if (profile.email_verified) score += 15

  // Phone verification (+10)
  if (profile.phone_verified) score += 10

  // Account age
  const accountAge = Date.now() - new Date(profile.created_at).getTime()
  const daysOld = accountAge / (1000 * 60 * 60 * 24)
  if (daysOld > 30) score += 5
  if (daysOld > 90) score += 5
  if (daysOld > 365) score += 5

  // Login consistency (+10 for regular logins)
  if (profile.login_count > 10) score += 5
  if (profile.login_count > 50) score += 5

  // Penalties
  // Failed logins (-5 each, max -20)
  score -= Math.min((profile.failed_login_count || 0) * 5, 20)

  // Suspicious activity (-10 each, max -30)
  score -= Math.min((profile.suspicious_activity_count || 0) * 10, 30)

  // Violation count (-15 each)
  score -= (profile.violation_count || 0) * 15

  // If flagged, reduce significantly
  if (profile.flagged_at) score -= 25

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, score))

  // Determine security status
  let securityStatus = 'NEW_USER'
  if (profile.is_verified) {
    securityStatus = 'VERIFIED'
  } else if (score >= 70) {
    securityStatus = 'TRUSTED'
  } else if (score < 30 || profile.flagged_at) {
    securityStatus = 'FLAGGED'
  } else if (score < 50) {
    securityStatus = 'SUSPICIOUS'
  }

  // Update profile
  await supabase
    .from('profiles')
    .update({
      trust_score: score,
      security_status: securityStatus,
    })
    .eq('id', userId)

  return score
}

/**
 * Create or update user session
 */
export async function trackSession(userId: string, action: 'start' | 'update' | 'end'): Promise<void> {
  try {
    const supabase = await createClient()
    const headersList = await headers()
    
    const userAgent = headersList.get('user-agent')
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    const { deviceType, browser, os } = parseUserAgent(userAgent)

    if (action === 'start') {
      await supabase.from('user_sessions').insert({
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType,
        browser,
        os,
      })
    } else if (action === 'update') {
      // Update the most recent active session
      await supabase
        .from('user_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('started_at', { ascending: false })
        .limit(1)
    } else if (action === 'end') {
      // End all active sessions for user
      await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('is_active', true)
    }
  } catch (error) {
    console.error('[Security] Failed to track session:', error)
  }
}
