import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidateSite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Business details, contact number and search engine settings used across the page.',
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            { name: 'businessName', type: 'text', required: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Digits only, with country code and no plus sign, e.g. 601111501005. Every WhatsApp button and the phone link use this number.',
                  },
                  validate: (value: null | string | undefined) =>
                    /^\d{9,15}$/.test(value ?? '') ||
                    'Use digits only, with country code, e.g. 601111501005',
                },
                {
                  name: 'phoneDisplay',
                  type: 'text',
                  required: true,
                  admin: { description: 'The number as shown on the page, e.g. 011-1150 1005.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'locality', type: 'text', required: true, label: 'Town' },
                { name: 'region', type: 'text', required: true, label: 'State' },
              ],
            },
            {
              name: 'whatsappGreeting',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Opens every pre-filled WhatsApp message the page builds for a visitor, e.g. "Hi Saiboss!".',
              },
            },
            {
              name: 'defaultWhatsappMessage',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Pre-filled message for the general WhatsApp buttons: header, floating button and footer.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              admin: {
                description:
                  'The live address without a trailing slash, e.g. https://tongrorobin.com',
              },
              validate: (value: null | string | undefined) =>
                /^https?:\/\/[^/]+$/.test(value ?? '') ||
                'Use a full address without a trailing slash, e.g. https://tongrorobin.com',
            },
            { name: 'metaTitle', type: 'text', required: true },
            { name: 'metaDescription', type: 'textarea', required: true },
            {
              name: 'ogDescription',
              type: 'textarea',
              label: 'Social share description',
              admin: {
                description: 'Shown when the link is shared. Falls back to the meta description.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Social share image',
              admin: { description: 'Also used as the business image in Google structured data.' },
            },
            {
              name: 'schemaDescription',
              type: 'textarea',
              label: 'Business description for Google',
              admin: { description: 'The description in the LocalBusiness structured data.' },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'footerDescription', type: 'textarea' },
            {
              name: 'footerDescriptionEn',
              type: 'textarea',
              label: 'Footer description (English)',
            },
          ],
        },
      ],
    },
  ],
}
