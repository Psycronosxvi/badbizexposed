import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/providers/auth-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: 'BadBizExposed - Report Bad Landlords, HOAs & Property Managers',
    template: '%s | BadBizExposed',
  },
  description: 'File complaints and read reviews about property management companies, landlords, HOAs, and rental properties. Join thousands protecting consumer rights. Report maintenance issues, security deposit theft, and tenant rights violations.',
  keywords: [
    'landlord complaints',
    'property management reviews',
    'HOA complaints',
    'tenant rights',
    'rental complaints',
    'bad landlord report',
    'security deposit theft',
    'apartment reviews',
    'property manager complaints',
    'consumer protection',
    'tenant advocacy',
    'rental property issues',
    'maintenance complaints',
    'lease violations',
    'Mobile Alabama apartments',
    'Oak Tree Apartments reviews',
    'Plantation Apartments complaints',
    'Maddox Properties reviews',
  ],
  authors: [{ name: 'BadBizExposed' }],
  creator: 'BadBizExposed',
  publisher: 'BadBizExposed',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'BadBizExposed - Protecting Your Consumer Rights',
    description: 'Expose bad businesses. File complaints against property managers, landlords, and HOAs. Read reviews and protect yourself.',
    type: 'website',
    locale: 'en_US',
    siteName: 'BadBizExposed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BadBizExposed',
    description: 'Report bad landlords, property managers, and HOAs. Protect your tenant rights.',
  },
  verification: {
    google: 'verification_token',
  },
  alternates: {
    canonical: 'https://badBizexposed.com',
  },
}

export const viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
