import { CogIcon } from '@sanity/icons'
import { User } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'scripts',
      title: 'Scripts',
    },
  ],
  fields: [
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'navLinks',
      group: 'header',
    }),
    defineField({
      name: 'contactGeneral',
      title: 'Contact Main Email',
      type: 'string',
      group: 'header',
      placeholder: 'info@fastfollow.co',
    }),
    defineField({
      name: 'contactTeam',
      title: 'Contact Team Members',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
            }),
            defineField({
              name: 'phone',
              title: 'Phone',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              name: 'name',
              role: 'role',
              email: 'email',
              phone: 'phone',
            },
            prepare({ name, role, email, phone }) {
              const details = [role, email, phone].filter(Boolean).join(' / ')
              return {
                title: name,
                subtitle: details,
                media: User,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialIcons',
      title: 'Footer Social Links',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'socialLink',
        },
      ],
    }),
    defineField({
      name: 'footerLocation',
      title: 'Footer Location',
      type: 'text',
      rows: 1,
      group: 'footer',
      placeholder: 'Los Angeles, CA',
    }),
    defineField({
      name: 'title',
      description: 'Used as the base in the <title> tag for SEO',
      title: 'Site Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'Global SEO',
      description: 'Fallback SEO content for any page left blank',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'googletagmanagerID',
      title: 'Google Tag Manager ID',
      type: 'string',
      description:
        'If you need a cookie consent banner, use the custom scripts field below instead of this.',
      group: 'scripts',
    }),
    defineField({
      name: 'customScripts',
      title: 'Custom Scripts',
      type: 'array',
      of: [
        {
          name: 'customScript',
          title: 'Custom Script',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name (for your reference)',
              type: 'string',
            },
            {
              name: 'script',
              title: 'Script',
              type: 'text',
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              description:
                'Necessary: scripts that are required for the site to function. (e.g. Support chat, etc.) Analytics: scripts that are used to track site usage. (Triggers cookie consent banner) Marketing: scripts that are used to track marketing efforts. (Triggers cookie consent banner)',
              options: {
                list: ['necessary', 'analytics', 'marketing'],
              },
              initialValue: 'necessary',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              name: 'name',
              category: 'category',
            },
            prepare({ name = 'Custom Script', category }) {
              return {
                title: name,
                subtitle: category,
              }
            },
          },
        },
      ],
      group: 'scripts',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
