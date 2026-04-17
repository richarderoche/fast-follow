import { Clapperboard } from 'lucide-react'
import { defineField, defineType } from 'sanity'

/** Sanity `date` values are `YYYY-MM-DD`. Preview: m/d yy (no leading zeros on m or d). */
function formatCompactUsDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return iso
  const y = Number(match[1])
  const m = Number(match[2])
  const d = Number(match[3])
  const yy = String(y % 100).padStart(2, '0')
  return `${m}/${d}/${yy}`
}

export default defineType({
  name: 'videoProject',
  title: 'Video Projects',
  type: 'document',
  icon: Clapperboard,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date (YYYY-MM-DD)',
      description: 'This controls the order in the video feed (newest first).',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoAsset',
      title: 'Video File',
      description: 'Must be less than 500 MB and 30 minutes in duration',
      type: 'mux.video',
      options: {
        maxAssetFileSize: 1024 * 1024 * 500, // 500 MB
        maxAssetDuration: 30 * 60, // 30 minutes
      },
    }),
    defineField({
      name: 'thumbnailtime',
      title: 'Video Thumbnail Time (in seconds)',
      description:
        'The time in seconds to get the thumbnail from the video. Defaults to first frame if left blank.',
      type: 'number',
    }),
    defineField({
      name: 'formats',
      title: 'Formats',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'videoFormat' }] }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      description:
        'If multiple artists are included, order here does not matter (determined by the priority number in the role entry)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artist' }] }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'directors',
      title: 'Director/Directors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'agencies',
      title: 'Agency/Agencies',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
    }),
    defineField({
      name: 'manualCredits',
      title: 'Manual Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
            }),
            defineField({
              name: 'names',
              title: 'Names',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      releaseDate: 'releaseDate',
      videoPlaybackId: 'videoAsset.asset.playbackId',
      thumbnailTime: 'thumbnailtime',
      formats: 'formats.0.title',
      artistFirstName: 'artists.0.firstName',
      artistLastName: 'artists.0.lastName',
    },
    prepare({
      title,
      releaseDate,
      videoPlaybackId,
      artistFirstName,
      thumbnailTime,
      artistLastName,
    }) {
      const videoThumbnail = videoPlaybackId ? (
        <img
          src={`https://image.mux.com/${videoPlaybackId}/thumbnail.webp?time=${thumbnailTime || 0}&width=100&height=100&fit_mode=smartcrop`}
          alt=""
        />
      ) : (
        Clapperboard
      )
      const details = [
        releaseDate ? formatCompactUsDate(releaseDate) : null,
        artistFirstName && artistLastName
          ? `${artistFirstName} ${artistLastName}`
          : null,
      ]
        .filter(Boolean)
        .join(' • ')
      return {
        title: title,
        subtitle: details,
        media: videoThumbnail,
      }
    },
  },
})
