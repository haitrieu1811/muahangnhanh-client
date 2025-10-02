import type { MetadataRoute } from 'next'

import { ENV_CONFIG } from '@/constants/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/me/'
    },
    sitemap: `${ENV_CONFIG.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
  }
}
