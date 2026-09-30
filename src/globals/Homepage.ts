import type { Field, GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidateSite'

const LINK_HELP =
  'To link a phrase to WhatsApp write [phrase](wa:message to pre-fill). For a normal link write [phrase](https://address).'

const sectionHead = (withLede = true): Field[] => [
  {
    name: 'eyebrow',
    type: 'text',
    admin: { description: 'The small red label above the heading.' },
  },
  {
    name: 'heading',
    type: 'textarea',
    required: true,
    admin: { description: 'A new line here is a line break on the page.' },
  },
  ...(withLede ? [{ name: 'lede', type: 'textarea', label: 'Intro paragraph' } as Field] : []),
]

const whatsappCta = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', type: 'text', required: true, label: 'Button text' },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Pre-filled WhatsApp message',
    },
  ],
})

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Everything on the landing page, one tab per section, in page order.',
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            {
              name: 'tag',
              type: 'text',
              admin: { description: 'The small line above the headline.' },
            },
            {
              name: 'heading',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Each line animates in separately. Keep to three lines at most.',
              },
            },
            { name: 'sub', type: 'textarea', label: 'Supporting paragraph' },
            whatsappCta('primaryCta', 'Main button'),
            {
              name: 'secondaryCtaLabel',
              type: 'text',
              label: 'Second button text',
              admin: { description: 'Scrolls to the sizes and pricing section.' },
            },
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'The still shown before the film loads and on slow connections.',
              },
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Short looping film without sound. Keep it under about 3 MB.' },
            },
          ],
        },
        {
          label: 'Figures',
          fields: [
            {
              name: 'figures',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Figure', plural: 'Figures' },
              admin: { description: 'The row of counted-up numbers under the hero.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'prefix', type: 'text', admin: { description: 'e.g. RM' } },
                    { name: 'value', type: 'number', required: true, min: 0 },
                    { name: 'suffix', type: 'text', admin: { description: 'e.g. saiz' } },
                  ],
                },
                { name: 'caption', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          name: 'work',
          label: 'What We Handle',
          fields: [
            ...sectionHead(),
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Use', plural: 'Uses' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            { name: 'note', type: 'textarea', admin: { description: LINK_HELP } },
          ],
        },
        {
          name: 'moment',
          label: 'Delivery Banner',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'text', type: 'textarea', required: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          name: 'sizes',
          label: 'Sizes & Pricing',
          fields: [
            ...sectionHead(),
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              maxRows: 3,
              labels: { singular: 'Bin size', plural: 'Bin sizes' },
              admin: {
                description:
                  'The single source for sizes and prices: the size cards, both enquiry forms, the WhatsApp messages and the prices Google reads all come from here. Prices quoted in other text, such as the hero paragraph and the FAQ answers, are edited separately.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. Tong Kecil' },
                    },
                    {
                      name: 'shortName',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. Kecil' },
                    },
                    {
                      name: 'price',
                      type: 'number',
                      required: true,
                      min: 0,
                      label: 'Price from (RM)',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heightFt',
                      type: 'number',
                      required: true,
                      min: 1,
                      max: 5.5,
                      label: 'Height (ft)',
                      admin: {
                        description: 'The bin outline on the card is drawn to this height.',
                      },
                    },
                    {
                      name: 'widthFt',
                      type: 'number',
                      required: true,
                      min: 1,
                      label: 'Width (ft)',
                    },
                    {
                      name: 'lengthFt',
                      type: 'number',
                      required: true,
                      min: 1,
                      label: 'Length (ft)',
                    },
                    {
                      name: 'capacityM3',
                      type: 'number',
                      required: true,
                      min: 0,
                      label: 'Capacity (m³)',
                    },
                  ],
                },
                {
                  name: 'hint',
                  type: 'text',
                  admin: { description: 'One line on the card: what this size is for.' },
                },
                {
                  name: 'uses',
                  type: 'array',
                  label: 'Suitable for',
                  labels: { singular: 'Use', plural: 'Uses' },
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Technical drawing' },
                {
                  name: 'isDefault',
                  type: 'checkbox',
                  label: 'Selected when the page loads',
                },
              ],
            },
            {
              name: 'priceNote',
              type: 'text',
              admin: { description: 'The line under the price, saying what it includes.' },
            },
            {
              name: 'maxRentalDays',
              type: 'number',
              required: true,
              min: 1,
              max: 30,
              defaultValue: 7,
              admin: { description: 'Longest rental offered in the enquiry forms.' },
            },
            {
              name: 'help',
              type: 'group',
              label: 'Not sure which size?',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'text', type: 'textarea' },
                whatsappCta('cta', 'Button'),
              ],
            },
          ],
        },
        {
          name: 'process',
          label: 'How It Works',
          fields: [
            ...sectionHead(false),
            {
              name: 'steps',
              type: 'array',
              maxRows: 3,
              labels: { singular: 'Step', plural: 'Steps' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          name: 'why',
          label: 'Why Saiboss',
          fields: [
            ...sectionHead(),
            {
              name: 'reasons',
              type: 'array',
              labels: { singular: 'Reason', plural: 'Reasons' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
            {
              name: 'crew',
              type: 'array',
              maxRows: 2,
              label: 'Crew photos',
              labels: { singular: 'Photo', plural: 'Photos' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
            { name: 'credsLabel', type: 'text', label: 'Past clients label' },
            {
              name: 'creds',
              type: 'array',
              label: 'Past clients',
              labels: { singular: 'Client', plural: 'Clients' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'type', type: 'text', admin: { description: 'e.g. Lapangan terbang' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'coverage',
          label: 'Coverage',
          fields: [
            ...sectionHead(),
            {
              type: 'row',
              fields: [
                { name: 'baseName', type: 'text', required: true, label: 'Base town' },
                { name: 'baseTag', type: 'text', label: 'Label under the base town' },
              ],
            },
            {
              name: 'areas',
              type: 'array',
              labels: { singular: 'Area', plural: 'Areas' },
              admin: {
                description:
                  'Every other town served, besides the base. The list fills the two scrolling rows (first half on top), both enquiry forms and the areas Google reads.',
              },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            { name: 'note', type: 'textarea', admin: { description: LINK_HELP } },
            {
              name: 'background',
              type: 'upload',
              relationTo: 'media',
              label: 'Skyline background',
            },
          ],
        },
        {
          name: 'faq',
          label: 'FAQ',
          fields: [
            ...sectionHead(false),
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              admin: {
                description: 'Shown on the page and sent to Google as FAQ structured data.',
              },
              fields: [
                { name: 'question', type: 'text', required: true },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  admin: { description: LINK_HELP },
                },
              ],
            },
          ],
        },
        {
          name: 'booking',
          label: 'Booking',
          fields: [
            ...sectionHead(false),
            {
              name: 'points',
              type: 'array',
              labels: { singular: 'Point', plural: 'Points' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'callText',
              type: 'text',
              admin: {
                description:
                  'Comes before the phone number, e.g. "Lebih suka bercakap terus? Hubungi".',
              },
            },
            { name: 'formTitle', type: 'text' },
            { name: 'formSub', type: 'text', label: 'Line under the form title' },
            { name: 'formFine', type: 'text', label: 'Small print under the button' },
            {
              name: 'wasteTypes',
              type: 'array',
              labels: { singular: 'Waste type', plural: 'Waste types' },
              admin: { description: 'Options in the optional "Jenis sisa" dropdown.' },
              fields: [{ name: 'label', type: 'text', required: true }],
            },
            { name: 'background', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
