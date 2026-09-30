import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Homepage, Media } from '@/payload-types'

/** Both globals in one go, shared between `generateMetadata` and the page render. */
export const getSiteData = cache(async () => {
  const payload = await getPayload({ config })
  const [home, settings] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
  ])
  return { home, settings }
})

/** An upload field is the full document at depth 1, or just an id or null when unset or deleted. */
export const asMedia = (value: Media | null | number | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

export const waBase = (number: string): string => `https://wa.me/${number}?text=`

export const waLink = (number: string, message: string): string =>
  waBase(number) + encodeURIComponent(message)

/** Everything the page says about one bin size, derived from the few numbers the editor enters. */
export type BinSize = {
  name: string
  /** "Tong kecil", for running text. */
  nameLower: string
  short: string
  price: number
  heightFt: number
  /** "2 × 6 × 12 kaki" */
  dim: string
  /** Width and length on their own, " × 6 × 12 kaki", to follow an emphasised height. */
  dimTail: string
  capacityM3: number
  /** "±4 meter padu" */
  cap: string
  hint: string
  uses: string[]
  /** Value of the option in both enquiry forms, and what the WhatsApp message calls the bin. */
  form: string
  /** Pre-filled WhatsApp message for the "Tempah" button. */
  wa: string
  /** Offer name in the LocalBusiness structured data. */
  offerName: string
  imageAlt: string
  image: Media | null
}

type SizeItem = Homepage['sizes']['items'][number]

export const toBinSize = (item: SizeItem, greeting: string): BinSize => {
  const short = item.shortName.toLowerCase()
  const compact = `${item.heightFt}x${item.widthFt}x${item.lengthFt} kaki`
  const dimTail = ` × ${item.widthFt} × ${item.lengthFt} kaki`
  const dim = `${item.heightFt}${dimTail}`

  return {
    name: item.name,
    nameLower: item.name.charAt(0) + item.name.slice(1).toLowerCase(),
    short: item.shortName,
    price: item.price,
    heightFt: item.heightFt,
    dim,
    dimTail,
    capacityM3: item.capacityM3,
    cap: `±${item.capacityM3} meter padu`,
    hint: item.hint ?? '',
    uses: (item.uses ?? []).map((use) => use.text),
    form: `tong roro ${short} (${compact})`,
    wa: `${greeting} Saya nak sewa *tong roro ${short}* (${compact}). Boleh bagi harga dan tarikh kosong?`,
    offerName: `Tong roro ${short} (${dim}, ±${item.capacityM3} meter padu)`,
    imageAlt: `Rajah teknikal tong roro ${short}: ${dim}, muatan lebih kurang ${item.capacityM3} meter padu`,
    image: asMedia(item.image),
  }
}

/** Index of the size selected on load: the one ticked in the CMS, else the first. */
export const defaultSizeIndex = (items: SizeItem[]): number =>
  Math.max(
    0,
    items.findIndex((item) => item.isDefault),
  )
