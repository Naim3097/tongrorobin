import { revalidatePath } from 'next/cache'
import type { PayloadRequest } from 'payload'

/**
 * The landing page is prerendered, so every content change has to clear it.
 * Pass `context: { disableRevalidate: true }` when writing from outside a Next.js
 * request (the seed script), where there is no cache to revalidate.
 */
export const revalidateSite = ({ req }: { req: PayloadRequest }): void => {
  if (req.context.disableRevalidate) return

  req.payload.logger.info('Revalidating site')
  revalidatePath('/', 'layout')
}
