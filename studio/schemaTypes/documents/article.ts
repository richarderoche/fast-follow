import { StackCompactIcon } from '@sanity/icons'
import { NotebookPen } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Blog Posts',
  type: 'document',
  icon: NotebookPen,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date (YYYY-MM-DD)',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Thumbnail',
      type: 'image',
      options: {
        hotspot: {
          previews: [{ title: '4:3', aspectRatio: 4 / 3 }],
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImageAlt',
      title: 'Cover Image Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'introText',
      title: 'Intro/Summary Text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External Link', value: 'external' },
        ],
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link',
      type: 'url',
      hidden: ({ parent }) => parent?.postType !== 'external',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.postType === 'external' && !value) {
            return 'Required when post type is External Link'
          }
          return true
        }),
    }),
    defineField({
      title: 'Page Builder',
      name: 'pbSections',
      type: 'pbSections',
      hidden: ({ parent }) => parent?.postType !== 'internal',
      icon: StackCompactIcon,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      description:
        'Override image and description here (defaults to cover image and introduction text).',
      hidden: ({ parent }) => parent?.postType !== 'internal',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      postType: 'postType',
      coverImage: 'coverImage.asset',
      tag1: 'tags.0.title',
      tag2: 'tags.1.title',
      tag3: 'tags.2.title',
    },
    prepare({ title, postType, coverImage, tag1, tag2, tag3 }) {
      const tags = []
      if (tag1) tags.push(tag1)
      if (tag2) tags.push(tag2)
      if (tag3) tags.push(tag3)
      if (tags.length === 0) tags.push('(None Set)')
      const tagsString = tags.join(', ')
      return {
        title,
        subtitle: `${postType === 'external' ? 'External' : 'Page'} / Tags: ${tagsString}`,
        media: coverImage || NotebookPen,
      }
    },
  },
})
