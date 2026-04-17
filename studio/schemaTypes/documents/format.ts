import { Ratio } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'videoFormat',
  title: 'Video Formats',
  type: 'document',
  icon: Ratio,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Sorting Priority (Higher values appear first)',
      description:
        'Used for sorting in the UI. Suggested to use three digits for easier future expansion. (e.g. 100, 200, 250, 300)',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      priority: 'priority',
    },
    prepare({ title, priority }) {
      return { title: title, subtitle: `Priority: ${priority}`, media: Ratio }
    },
  },
})
