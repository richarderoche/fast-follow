import { DocumentSheetIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ptSingle',
  title: 'RTE',
  type: 'array',
  of: [
    {
      type: 'block',
      options: {
        oneLine: true,
      },
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'Url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              }),
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            icon: DocumentSheetIcon,
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{ type: 'page' }],
              }),
            ],
          },
        ],
      },
      styles: [],
      lists: [],
    },
  ],
})
