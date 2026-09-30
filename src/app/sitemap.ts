import type { MetadataRoute } from 'next'

import { getSiteData } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { home, settings } = await getSiteData()
  if (!settings.siteUrl) return []

  return [
    {
      url: `${settings.siteUrl}/`,
      lastModified: home.updatedAt ?? undefined,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
