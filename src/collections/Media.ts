import type { CollectionConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidateSite'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Photos and the hero film. Files are stored in Vercel Blob.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description:
          'Describes the image for screen readers and search engines. Leave empty for videos and purely decorative backgrounds.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
  },
}
