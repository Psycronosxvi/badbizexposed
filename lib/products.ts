export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: 'month' | 'year'
  features: string[]
}

// Premium subscription plans
export const PRODUCTS: Product[] = [
  {
    id: 'premium-monthly',
    name: 'Premium Membership',
    description: 'Get unlimited complaints, priority visibility, and exclusive features',
    priceInCents: 199, // $1.99/month
    interval: 'month',
    features: [
      'Unlimited complaint submissions',
      'Priority visibility for your complaints',
      'Access to premium dashboard',
      'Export complaints to PDF/CSV',
      'Watchlist & favorites',
      'Complaint analytics',
      'Ad-free experience',
      'Early access to new features',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Premium Membership (Annual)',
    description: 'Save 16% with annual billing',
    priceInCents: 1999, // $19.99/year (save ~$4)
    interval: 'year',
    features: [
      'Unlimited complaint submissions',
      'Priority visibility for your complaints',
      'Access to premium dashboard',
      'Export complaints to PDF/CSV',
      'Watchlist & favorites',
      'Complaint analytics',
      'Ad-free experience',
      'Early access to new features',
      '2 months free',
    ],
  },
]

// Free tier limits
export const FREE_TIER_LIMITS = {
  complaintsPerMonth: 3,
  canExport: false,
  hasAnalytics: false,
  hasPriorityVisibility: false,
  hasWatchlist: false,
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

// Check if product is subscription
export function isSubscription(product: Product): boolean {
  return !!product.interval
}
