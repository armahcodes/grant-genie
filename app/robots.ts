import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://headspacegenie.ai'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/settings/',
          '/profile/',
          '/grant-application/',
          '/grant-search/',
          '/genies/',
          '/compliance-tracker/',
          '/reporting/',
          '/resources/',
          '/support/',
          '/notifications/',
          '/onboarding/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
