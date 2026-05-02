-- Core tables only

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
