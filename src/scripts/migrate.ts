/**
 * Applies pending database migrations. Run before every build (`pnpm ci`).
 *
 * This goes through tsx directly rather than `payload migrate`: on Node 22 the Payload CLI
 * was seen to exit 0 without running anything about one time in four, which would let a
 * deploy go out against an unmigrated database.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
await payload.db.migrate()
await payload.destroy()
process.exit(0)
