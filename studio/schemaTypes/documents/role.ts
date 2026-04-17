import { UserCog } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artistRole',
  title: 'Artist Roles',
  type: 'document',
  icon: UserCog,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'plural',
      title:
        'Pluralized Title (Optional if title works for both singular and plural)',
      type: 'string',
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
      plural: 'plural',
      priority: 'priority',
    },
    prepare({ title, plural, priority }) {
      return {
        title: title + (plural ? ` / ${plural}` : ''),
        subtitle: `Priority: ${priority}`,
        media: UserCog,
      }
    },
  },
})
