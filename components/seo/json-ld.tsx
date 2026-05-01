import Script from 'next/script'

interface OrganizationSchemaProps {
  name: string
  url: string
  logo?: string
  description?: string
}

export function OrganizationSchema({ name, url, logo, description }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs: [],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface LocalBusinessSchemaProps {
  name: string
  url: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  telephone?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
  reviews?: Array<{
    author: string
    datePublished: string
    reviewRating: number
    reviewBody: string
  }>
}

export function LocalBusinessSchema({ name, url, address, telephone, aggregateRating, reviews }: LocalBusinessSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url,
  }

  if (address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country || 'US',
    }
  }

  if (telephone) {
    schema.telephone = telephone
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (reviews && reviews.length > 0) {
    schema.review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
    }))
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebPageSchemaProps {
  name: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}

export function WebPageSchema({ name, description, url, datePublished, dateModified }: WebPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    datePublished,
    dateModified,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BadBizExposed',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://badbizexposed.com',
    },
  }

  return (
    <Script
      id="webpage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
