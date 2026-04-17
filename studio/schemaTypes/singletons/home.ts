import { HomeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title (for backend use only)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'This goes after the words "FastFollow" in the intro.',
      type: 'string',
      placeholder: 'e.g. "is a commercial editorial house."',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Home',
        title,
      }
    },
  },
})
