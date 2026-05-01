# BadBizExposed.com - Deployment Guide

## Prerequisites

- Node.js 18+ and pnpm
- Supabase project
- Stripe account
- HuggingFace API key (optional, for AI features)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret from Stripe

## Database Setup

1. Create the following tables in Supabase:

### Users Table (Uses Supabase Auth)
```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  is_admin boolean default false,
  subscription_status text default 'free',
  subscription_id text,
  created_at timestamptz default now()
);
```

### Complaints Table
```sql
create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  location text,
  category text,
  description text not null,
  rating int check (rating between 1 and 5),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  upvotes int default 0,
  downvotes int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Businesses Table
```sql
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text,
  avg_rating float,
  complaint_count int default 0,
  created_at timestamptz default now()
);
```

### Votes Table
```sql
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  complaint_id uuid references public.complaints(id) on delete cascade,
  value int check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique(user_id, complaint_id)
);
```

### Comments Table
```sql
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  complaint_id uuid references public.complaints(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
```

### Subscriptions Table
```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text default 'free',
  status text default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

2. Enable Row Level Security (RLS) on all tables
3. Create appropriate RLS policies for each table

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

4. Copy the signing secret and set it as `STRIPE_WEBHOOK_SECRET`

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

```bash
# Or deploy directly with Vercel CLI
vercel deploy
```

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Feature Endpoints

### Public Pages
- `/` - Homepage
- `/companies` - Company directory
- `/complaints` - Complaint feed
- `/trending` - Trending complaints
- `/business/[slug]` - Business profile
- `/search` - Search complaints
- `/pricing` - Pricing & subscription

### Auth Pages (No UI Login)
- `/auth/login` - Login
- `/auth/sign-up` - Sign up
- `/auth/sign-up-success` - Confirmation

### Protected Pages (Requires Login)
- `/submit` - Submit complaint
- `/dashboard` - User dashboard

### Admin Pages (Admin only, role protected)
- `/admin` - Dashboard
- `/admin/complaints` - Moderation queue
- `/admin/users` - User management
- `/admin/ai-tools` - AI verification tools
- `/admin/subscriptions` - Subscription management

## API Routes

### Public API
- `GET /api/comments?complaintId=id` - Get comments
- `POST /api/vote` - Vote on complaint

### Protected API
- `POST /api/comments` - Create comment
- `POST /api/report` - Report complaint

### Admin API
- `POST /api/admin/ai/verify-complaint` - AI verification
- `POST /api/admin/ai/semantic-search` - Semantic search
- `GET|POST /api/admin/ai/settings` - AI settings
- `POST /api/webhooks/stripe` - Stripe webhooks

## Performance Optimization

- SEO metadata on all pages via metadata exports
- Sitemap auto-generation
- robots.txt configuration
- JSON-LD structured data for businesses and reviews
- Image optimization with Next.js Image component
- CSS minification with Tailwind v4

## Monitoring

- Check server logs in Vercel dashboard
- Monitor Stripe webhook deliveries
- Set up error tracking (e.g., Sentry)
- Monitor database performance in Supabase dashboard

## Troubleshooting

**Build fails with "@supabase/ssr not found"**
- Run `pnpm install` and rebuild

**Stripe webhooks not firing**
- Verify webhook secret matches in `.env.local`
- Check Stripe dashboard for failed deliveries
- Ensure endpoint URL is publicly accessible

**Database errors**
- Verify RLS policies allow operations
- Check foreign key constraints
- Ensure service role key has permissions

## Next Steps

1. Set up email verification (Supabase Auth)
2. Implement image uploads (Vercel Blob)
3. Add analytics (PostHog/Mixpanel)
4. Set up automated backups
5. Implement user notifications
