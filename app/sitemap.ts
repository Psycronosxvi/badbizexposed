import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://consumerwatchh.network'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/complaints`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
  
  // Dynamic company pages
  let companyPages: MetadataRoute.Sitemap = []
  try {
    const { data: companies } = await supabase
      .from('companies')
      .select('slug, updated_at')
      .order('complaint_count', { ascending: false })
      .limit(1000)
    
    if (companies) {
      companyPages = companies.map((company) => ({
        url: `${BASE_URL}/business/${company.slug}`,
        lastModified: new Date(company.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching companies for sitemap:', error)
  }
  
  // Dynamic complaint pages
  let complaintPages: MetadataRoute.Sitemap = []
  try {
    const { data: complaints } = await supabase
      .from('complaints')
      .select('id, updated_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5000)
    
    if (complaints) {
      complaintPages = complaints.map((complaint) => ({
        url: `${BASE_URL}/complaints/${complaint.id}`,
        lastModified: new Date(complaint.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Error fetching complaints for sitemap:', error)
  }
  
  return [...staticPages, ...companyPages, ...complaintPages]
}
