import { revalidatePath } from 'next/cache'
import type { PayloadRequest } from 'payload'

/**
 * The landing page is prerendered, so every content change has to clear it.
 * `sitemap.xml` and `robots.txt` are separate metadata routes that sit outside
 * the page's layout tree, so revalidating `/` alone leaves them on the cache
 * built at deploy time. They both read `siteUrl`, so they have to be cleared
 * too or a domain change only lands on the page itself.
 * Pass `context: { disableRevalidate: true }` when writing from outside a Next.js
 * request (the seed script), where there is no cache to revalidate.
 */
export const revalidateSite = ({ req }: { req: PayloadRequest }): void => {
  if (req.context.disableRevalidate) return

  req.payload.logger.info('Revalidating site')
  revalidatePath('/', 'layout')
  revalidatePath('/sitemap.xml')
  revalidatePath('/robots.txt')
}
