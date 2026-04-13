import { StackCompactIcon } from '@sanity/icons'
import { Notebook } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  icon: Notebook,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      initialValue: {
        current: 'blog',
      },
      hidden: () => true,
    }),
    defineField({
      name: 'pbSections',
      title: 'Page Builder (Above Blog Feed)',
      type: 'pbSections',
      icon: StackCompactIcon,
    }),
    defineField({
      name: 'postsPerLoad',
      title: 'Posts per Load',
      type: 'number',
      initialValue: 6,
      options: {
        list: [
          { title: '6', value: 6 },
          { title: '12', value: 12 },
          { title: '18', value: 18 },
        ],
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title,
        media: Notebook,
      }
    },
  },
})
