import type { MetadataRoute } from 'next'

import { getSiteData } from '@/lib/site'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getSiteData()

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: settings.siteUrl ? `${settings.siteUrl}/sitemap.xml` : undefined,
  }
}
