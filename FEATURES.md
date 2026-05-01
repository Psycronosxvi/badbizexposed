# BadBizExposed.com - Complete Feature Documentation

## Overview

BadBizExposed.com is a full-featured complaint platform where users can file complaints against businesses, read reviews, and discover trends. The platform includes authentication, a premium subscription model, AI verification tools, and a comprehensive admin panel.

## Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19, TailwindCSS v4
- **Backend**: Next.js API Routes, Server Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Subscriptions ($1.99/month)
- **AI**: HuggingFace integration for complaint verification
- **Search**: Semantic search with embeddings

### Project Structure

```
├── app/
│   ├── api/                    # API routes
│   ├── admin/                  # Admin panel pages
│   ├── auth/                   # Authentication pages
│   ├── business/[slug]/        # Business profile pages
│   ├── companies/              # Company directory
│   ├── complaints/             # Complaint listing & detail
│   ├── dashboard/              # User dashboard
│   ├── pricing/                # Pricing page
│   ├── search/                 # Search page
│   └── page.tsx                # Homepage
├── components/                 # Reusable React components
├── lib/
│   ├── supabase/              # Supabase clients
│   ├── stripe.ts              # Stripe utilities
│   ├── products.ts            # Product definitions
│   └── types.ts               # TypeScript definitions
└── public/                     # Static assets
```

## Features

### 1. User Authentication
- **Supabase Auth** with email/password
- OAuth (Google, GitHub - configurable)
- Email verification
- Secure sessions with HTTP-only cookies
- Rate limiting on signup/login

**Routes:**
- `/auth/login` - Login page
- `/auth/sign-up` - Sign up page
- `/auth/callback` - OAuth callback handler
- `/auth/signout` - Logout route

### 2. Complaint System
Users can submit detailed complaints after login.

**Complaint Fields:**
- Business name (required)
- Location (city/state/zip)
- Category (dropdown)
- Rating (1-5 stars)
- Detailed description (50+ characters minimum)
- Photo/video upload
- Anonymous submission option (hides username publicly)

**Features:**
- Moderation queue (admin approval required)
- Upvote/downvote system
- Comments section
- Abuse reporting
- Share buttons

**Routes:**
- `/submit` - Submit complaint form (protected)
- `/complaints` - Feed with filtering
- `/complaints/[id]` - Single complaint detail
- `/trending` - Trending complaints

**API Endpoints:**
- `POST /api/vote` - Vote on complaint
- `POST /api/comments` - Post comment
- `GET /api/comments?complaintId=id` - Get comments
- `POST /api/report` - Report abuse

### 3. Business Pages
Auto-generated business profiles created from complaints.

**Features:**
- Auto-created on first complaint submission
- Aggregated complaint count & average rating
- Complaint feed filtered by business
- "Watch business" functionality
- SEO-optimized with structured data

**Routes:**
- `/business/[slug]` - Business profile page
- Dynamic slug generation from business name

### 4. Search & Discovery
Find complaints by business, location, or category.

**Routes:**
- `/search` - Advanced search interface
- `/companies` - Company directory with filters
- `/map` - Geographic complaint distribution map

### 5. Premium Membership ($1.99/month)

**Free Plan:**
- 3 complaints per month
- Basic search
- Read-only access

**Premium Plan ($1.99/month):**
- Unlimited complaints
- Priority visibility
- Export to PDF/CSV
- Advanced analytics dashboard
- Watchlist & favorites
- API access

**Implementation:**
- Stripe Checkout subscription
- Recurring billing
- Automatic renewal
- Cancel anytime
- Billing portal integration

**Routes:**
- `/pricing` - Pricing page
- Stripe checkout integration

### 6. User Dashboard (Premium Only)
Personal analytics and management hub.

**Features:**
- My complaints listing
- Favorites & watchlist
- Complaint statistics
- Export options (PDF, CSV)
- Subscription status
- Billing portal link

**Route:**
- `/dashboard` - User dashboard (protected)

### 7. Admin Panel

#### Overview
- `/admin` - Admin dashboard with key metrics

#### Complaint Moderation
- `/admin/complaints` - Approval/rejection queue
- Mass moderation actions
- View complaint details before publishing

#### User Management  
- `/admin/users` - User listing
- Ban/unban users
- Promote/demote admin roles
- View user stats

#### Subscription Management
- `/admin/subscriptions` - Stripe subscription overview
- Refund management
- Payment history
- Churn analysis

#### AI Tools
- `/admin/ai-tools` - AI verification & search
- **Complaint Verification**: AI scores fakeness, toxicity, duplicates
- **Semantic Search**: Find similar complaints with natural language
- HuggingFace API key management (encrypted in DB)

**Admin API Endpoints:**
- `POST /api/admin/ai/verify-complaint` - Run AI verification
- `POST /api/admin/ai/semantic-search` - Semantic search
- `GET|POST /api/admin/ai/settings` - Manage AI settings

#### Review Tracking (Bonus)
- `/admin/reviews` - Track negative reviews across platforms
- Priority monitoring for specific properties
- Severity assessment
- Legal risk flagging

### 8. SEO & Performance

**Implementation:**
- Dynamic metadata for every page
- OpenGraph & Twitter cards
- JSON-LD structured data
  - `LocalBusiness` schema for businesses
  - `Review` schema for complaints
  - `AggregateRating` for business ratings
- Sitemap auto-generation (`/sitemap.xml`)
- robots.txt configuration
- Clean URL slugs
- Core Web Vitals optimized

**Files:**
- `/app/sitemap.ts` - Dynamic sitemap generation
- `/app/robots.ts` - robots.txt configuration
- `/components/seo/json-ld.tsx` - Structured data component

### 9. AI Integration (HuggingFace)

#### Complaint Verification
Admin can run AI on any complaint to get:
- Fakeness probability (0-100)
- Toxicity score (0-100)
- Duplicate similarity score (0-100)
- AI recommendation (approve/reject/manual_review)

#### Semantic Search
Find complaints using natural language:
- "Find complaints about maintenance issues"
- "Search for reviews mentioning mold"
- Uses embeddings + pgvector for similarity

#### Security
- API keys encrypted in database
- Admin-only access
- Audit logging of AI operations

**Routes:**
- `/admin/ai-tools` - Settings & tools interface

## Security Features

- **XSS Prevention**: React escaping + Content Security Policy
- **CSRF Protection**: Token-based state handling
- **SQL Injection**: Parameterized queries via Supabase
- **Rate Limiting**: Login/signup attempts throttled
- **Input Validation**: Zod schemas on all forms
- **Admin Auth**: Role-based access control
- **Encrypted Keys**: AI API keys encrypted at rest
- **Secure Webhooks**: Stripe signature verification
- **Audit Logs**: All admin actions tracked

## Database Models

### Users (via Supabase Auth)
```
id, email, password_hash, created_at, email_verified
```

### Profiles
```
id (PK), email, full_name, is_admin, subscription_status, created_at
```

### Complaints
```
id, user_id, business_name, location, category, description, rating,
status (pending|approved|rejected), upvotes, downvotes, created_at
```

### Businesses
```
id, slug, name, location, avg_rating, complaint_count, created_at
```

### Votes
```
id, user_id, complaint_id, value (-1|1), created_at
```

### Comments
```
id, user_id, complaint_id, content, created_at
```

### Subscriptions
```
id, user_id, stripe_customer_id, stripe_subscription_id, plan, status, 
current_period_start, current_period_end, created_at
```

### Abuse Reports
```
id, reporter_id, complaint_id, reason, status, created_at
```

## API Reference

### Authentication
- `POST /auth/sign-up` - Create account
- `POST /auth/sign-in` - Login (handled by Supabase)
- `POST /auth/callback` - OAuth callback

### Complaints
- `GET /api/complaints` - List complaints (public)
- `POST /api/complaints` - Create complaint (protected)
- `GET /api/complaints/[id]` - Get complaint detail (public)
- `DELETE /api/complaints/[id]` - Delete complaint (admin/owner)

### Votes
- `POST /api/vote` - Upvote/downvote complaint (protected)

### Comments
- `GET /api/comments?complaintId=id` - Get comments (public)
- `POST /api/comments` - Post comment (protected)
- `DELETE /api/comments/[id]` - Delete comment (admin/author)

### Search
- `GET /api/search?q=query&category=cat&state=state` - Search (public)

### Webhooks
- `POST /api/webhooks/stripe` - Stripe events (webhook)

### Admin
- `GET /api/admin/users` - List users (admin)
- `PUT /api/admin/users/[id]` - Update user (admin)
- `DELETE /api/admin/users/[id]` - Delete user (admin)
- `GET /api/admin/complaints` - List pending complaints (admin)
- `PUT /api/admin/complaints/[id]` - Approve/reject (admin)
- `POST /api/admin/ai/verify-complaint` - AI verification (admin)
- `POST /api/admin/ai/semantic-search` - AI search (admin)

## Environment Variables

See `.env.example` for complete list. Key variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
HUGGINGFACE_API_KEY
```

## Deployment

See `DEPLOYMENT.md` for complete deployment instructions including:
- Database schema setup
- Stripe webhook configuration
- Environment variables
- Vercel deployment steps

## Performance Metrics

- Homepage load: < 100ms
- Search results: < 500ms
- Page transitions: Instant (Next.js optimization)
- API responses: < 200ms average
- Image optimization: Automatic with Next.js Image

## Monitoring & Analytics

- **Error Tracking**: Sentry integration ready
- **Performance**: Web Vitals via Vercel Analytics
- **User Analytics**: PostHog/Mixpanel ready
- **Database**: Supabase query analytics
- **Payments**: Stripe dashboard

## Future Enhancements

- Email notifications for complaint replies
- Batch export for business owners
- Advanced admin reports
- Machine learning for duplicate detection
- Mobile app (React Native)
- Video complaint submissions
- Business response feature
- Reputation management tools

## Support & Contributing

For issues or feature requests, see DEPLOYMENT.md for troubleshooting steps.
