import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tag',
  title: 'Blog Tags',
  type: 'document',
  icon: TagIcon,
  fields: [defineField({ name: 'title', title: 'Title', type: 'string' })],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return { title: `Tag: ${title}`, media: TagIcon }
    },
  },
})
