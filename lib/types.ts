export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  reputation: number
  is_admin: boolean
  is_bot: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface State {
  id: string
  name: string
  abbreviation: string
  complaint_count: number
  created_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website: string | null
  category_id: string | null
  state_id: string | null
  city: string | null
  address: string | null
  phone: string | null
  complaint_count: number
  discussion_count: number
  avg_rating: number
  is_verified: boolean
  is_featured: boolean
  is_priority_tracking?: boolean
  created_at: string
  updated_at: string
  category?: Category
  state?: State
}

export interface Complaint {
  id: string
  title: string
  content: string
  company_id: string | null
  user_id: string | null
  category_id: string | null
  state_id: string | null
  city: string | null
  severity: number
  status: 'open' | 'resolved' | 'investigating' | 'closed'
  upvotes: number
  downvotes: number
  comment_count: number
  view_count: number
  is_anonymous: boolean
  is_featured: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  company?: Company
  user?: Profile
  category?: Category
  state?: State
}

export interface Discussion {
  id: string
  title: string
  content: string
  company_id: string | null
  user_id: string | null
  upvotes: number
  downvotes: number
  comment_count: number
  view_count: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  updated_at: string
  company?: Company
  user?: Profile
}

export interface Comment {
  id: string
  content: string
  user_id: string | null
  complaint_id: string | null
  discussion_id: string | null
  parent_id: string | null
  upvotes: number
  downvotes: number
  is_bot_generated: boolean
  created_at: string
  updated_at: string
  user?: Profile
  replies?: Comment[]
}

export interface ActivityFeedItem {
  id: string
  activity_type: 'complaint' | 'discussion' | 'comment' | 'vote' | 'user_joined' | 'evidence_uploaded'
  user_id: string | null
  complaint_id: string | null
  discussion_id: string | null
  comment_id: string | null
  company_id: string | null
  message: string | null
  is_bot_generated: boolean
  created_at: string
  user?: Profile
  company?: Company
  complaint?: Complaint
  discussion?: Discussion
}

export interface Scandal {
  id: string
  title: string
  summary: string
  company_id: string | null
  severity: number
  is_active: boolean
  source_url: string | null
  created_at: string
  expires_at: string | null
  company?: Company
}

export interface Vote {
  id: string
  user_id: string
  complaint_id: string | null
  discussion_id: string | null
  comment_id: string | null
  vote_type: 'up' | 'down'
  created_at: string
}

export interface Evidence {
  id: string
  complaint_id: string
  user_id: string | null
  file_url: string
  file_type: string | null
  file_name: string | null
  description: string | null
  created_at: string
}

export interface BotAccount {
  id: string
  profile_id: string
  name: string
  personality: string | null
  posting_frequency: 'low' | 'medium' | 'high'
  is_active: boolean
  last_activity_at: string | null
  total_posts: number
  total_comments: number
  created_at: string
  profile?: Profile
}

// Review tracking types
export interface Review {
  id: string
  company_id: string
  company_name: string
  review_source: 'Google' | 'Yelp' | 'Apartments.com' | 'Facebook' | 'BBB' | 'Zillow' | 'ConsumerAffairs' | 'TrustPilot' | 'Other'
  review_date: string
  reviewer_name: string | null
  star_rating: number
  review_type: 'Complaint' | 'Negative' | 'Neutral' | 'Positive'
  complaint_categories: string[]
  full_review_text: string
  severity_level: 'Low' | 'Moderate' | 'High' | 'Critical'
  repeat_issue_flag: boolean
  legal_risk_flag: boolean
  notes: string | null
}

export type ComplaintCategory = 
  | 'Maintenance Issues'
  | 'Pest Problems'
  | 'Safety/Crime Concerns'
  | 'Staff/Management Behavior'
  | 'Billing/Hidden Fees'
  | 'Property Condition'
  | 'Noise/Neighbors'
  | 'Lease/Contract Issues'

// Form types
export interface ComplaintFormData {
  title: string
  content: string
  company_name: string
  category_id: string
  state_id: string
  city: string
  severity: number
  is_anonymous: boolean
}

export interface DiscussionFormData {
  title: string
  content: string
  company_id: string
}

// Stats types
export interface PlatformStats {
  total_complaints: number
  total_users: number
  total_companies: number
  complaints_this_week: number
  active_discussions: number
  resolved_complaints: number
}
