import Image, { type ImageProps } from 'next/image'

import { asMedia } from '@/lib/site'
import type { Media } from '@/payload-types'

type Props = Omit<ImageProps, 'alt' | 'height' | 'src' | 'width'> & {
  media: Media | null | number | undefined
  /** Overrides the alt text stored with the file. */
  alt?: string
}

/** An uploaded image, resized and re-encoded on demand. Renders nothing while the field is empty. */
export function CmsImage({ media, alt, ...rest }: Props) {
  const file = asMedia(media)
  if (!file?.url || !file.width || !file.height) return null

  return (
    <Image
      src={file.url}
      width={file.width}
      height={file.height}
      alt={alt ?? file.alt ?? ''}
      {...rest}
    />
  )
}
