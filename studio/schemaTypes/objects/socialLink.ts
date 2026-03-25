import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconBrandThreads,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

const getIcon = (platform: string) => {
  switch (platform) {
    case 'Facebook':
      return IconBrandFacebook
    case 'Instagram':
      return IconBrandInstagram
    case 'Soundcloud':
      return IconBrandSoundcloud
    case 'Spotify':
      return IconBrandSpotify
    case 'X/Twitter':
      return IconBrandX
    case 'Threads':
      return IconBrandThreads
    case 'YouTube':
      return IconBrandYoutube
    case 'Github':
      return IconBrandGithub
    case 'Tiktok':
      return IconBrandTiktok
    default:
      return false
  }
}

export default defineType({
  title: 'Social Link',
  name: 'socialLink',
  type: 'object',
  options: {
    columns: 2,
    collapsible: false,
  },
  fields: [
    defineField({
      title: 'Platform',
      name: 'platform',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'Facebook' },
          { title: 'Instagram', value: 'Instagram' },
          { title: 'Soundcloud', value: 'Soundcloud' },
          { title: 'Spotify', value: 'Spotify' },
          { title: 'X/Twitter', value: 'X/Twitter' },
          { title: 'Threads', value: 'Threads' },
          { title: 'YouTube', value: 'YouTube' },
          { title: 'Tiktok', value: 'Tiktok' },
          { title: 'Github', value: 'Github' },
        ],
      },
    }),
    defineField({
      title: 'URL',
      name: 'url',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      platform: 'platform',
      url: 'url',
    },
    prepare({ platform, url }) {
      return {
        title: platform,
        subtitle: url ? url : '(url not set)',
        media: getIcon(platform),
      }
    },
  },
})
