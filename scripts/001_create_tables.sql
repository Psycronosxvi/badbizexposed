-- ComplaintHub Database Schema

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  is_bot BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  complaint_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- States
CREATE TABLE IF NOT EXISTS public.states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT NOT NULL UNIQUE,
  complaint_count INT DEFAULT 0
);

-- Companies
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website TEXT,
  category_id UUID REFERENCES public.categories(id),
  city TEXT,
  state_id UUID REFERENCES public.states(id),
  address TEXT,
  phone TEXT,
  description TEXT,
  complaint_count INT DEFAULT 0,
  discussion_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  state_id UUID REFERENCES public.states(id),
  city TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'under_review', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussion threads
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments (for both complaints and discussions)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT comment_target CHECK (
    (complaint_id IS NOT NULL AND discussion_id IS NULL) OR
    (complaint_id IS NULL AND discussion_id IS NOT NULL)
  )
);

-- Evidence/attachments
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_name TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes tracking
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, complaint_id),
  UNIQUE(user_id, discussion_id),
  UNIQUE(user_id, comment_id)
);

-- User follows (companies)
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Saved items
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity feed
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('complaint', 'discussion', 'comment', 'evidence', 'vote')),
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scandal banners
CREATE TABLE IF NOT EXISTS public.scandal_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  link_type TEXT CHECK (link_type IN ('complaint', 'discussion', 'company', 'category')),
  link_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Site statistics (for counters)
CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key TEXT NOT NULL UNIQUE,
  stat_value BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bot settings (for admin)
CREATE TABLE IF NOT EXISTS public.bot_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  posting_frequency INT DEFAULT 60, -- minutes between posts
  categories UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_post_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flagged content
CREATE TABLE IF NOT EXISTS public.flagged_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  flagged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'removed', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_category ON public.companies(category_id);
CREATE INDEX IF NOT EXISTS idx_companies_state ON public.companies(state_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_complaints_company ON public.complaints(company_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_company ON public.discussions(company_id);
CREATE INDEX IF NOT EXISTS idx_comments_complaint ON public.comments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_comments_discussion ON public.comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON public.activity_feed(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scandal_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: public read, own write
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: public read
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);

-- States: public read
CREATE POLICY "states_select_all" ON public.states FOR SELECT USING (true);

-- Companies: public read
CREATE POLICY "companies_select_all" ON public.companies FOR SELECT USING (true);

-- Complaints: public read, authenticated write
CREATE POLICY "complaints_select_all" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "complaints_insert_auth" ON public.complaints FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "complaints_update_own" ON public.complaints FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "complaints_delete_own" ON public.complaints FOR DELETE USING (auth.uid() = user_id);

-- Discussions: public read, authenticated write
CREATE POLICY "discussions_select_all" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "discussions_insert_auth" ON public.discussions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "discussions_update_own" ON public.discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "discussions_delete_own" ON public.discussions FOR DELETE USING (auth.uid() = user_id);

-- Comments: public read, authenticated write
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_auth" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Evidence: public read, authenticated write
CREATE POLICY "evidence_select_all" ON public.evidence FOR SELECT USING (true);
CREATE POLICY "evidence_insert_auth" ON public.evidence FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Votes: own read/write
CREATE POLICY "votes_select_own" ON public.votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "votes_insert_auth" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_delete_own" ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Follows: own read/write
CREATE POLICY "follows_select_own" ON public.follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "follows_insert_auth" ON public.follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (auth.uid() = user_id);

-- Saved items: own read/write
CREATE POLICY "saved_select_own" ON public.saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_auth" ON public.saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own" ON public.saved_items FOR DELETE USING (auth.uid() = user_id);

-- Activity feed: public read
CREATE POLICY "activity_select_all" ON public.activity_feed FOR SELECT USING (true);

-- Scandal banners: public read active only
CREATE POLICY "banners_select_active" ON public.scandal_banners FOR SELECT USING (is_active = true);

-- Site stats: public read
CREATE POLICY "stats_select_all" ON public.site_stats FOR SELECT USING (true);

-- Bot settings: admin only (using service role for now)
CREATE POLICY "bot_settings_select_admin" ON public.bot_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Flagged content: admin only
CREATE POLICY "flagged_select_admin" ON public.flagged_content FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "flagged_insert_auth" ON public.flagged_content FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
