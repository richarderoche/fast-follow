'use client'

import { getAllCredits } from '@/components/home/getAllCredits'
import { useProjectsStore } from '@/lib/store'
import {
  cn,
  cssRatio,
  getIsPortrait,
  getMuxImageSrc,
  imgSizesFormat,
} from '@/lib/utils'
import { AllProjectsQueryResult } from '@/sanity.types'
import MuxPlayer from '@mux/mux-player-react'
import Image from 'next/image'

export default function VideoProject({
  project,
  index,
}: {
  project: AllProjectsQueryResult[number]
  index: number
}) {
  const { video, title, thumbnailtime } = project
  const { playbackId, ratio } = video ?? {}
  const { thumbnailsPerRow = 2 } = useProjectsStore()
  const allCredits = getAllCredits(project)
  const trimmedCredits = allCredits.slice(0, 3)
  const isPortrait = getIsPortrait(ratio ?? '16:9')

  if (!playbackId) return null

  return (
    <div
      key={project._id}
      className={cn(
        'corner-container col-span-6 text-balance',
        thumbnailsPerRow > 1 && 'md:col-span-3',
        thumbnailsPerRow === 3 && 'lg:col-span-2',
        isPortrait &&
          thumbnailsPerRow < 2 &&
          'lg:col-span-5 lg:grid lg:grid-cols-5 lg:gap-gut-200 lg:items-center'
      )}
    >
      <div
        className={cn(
          'corner relative',
          isPortrait && thumbnailsPerRow < 2 && 'lg:col-span-2'
        )}
        style={{ aspectRatio: cssRatio(ratio ?? '16:9') }}
      >
        <Image
          src={getMuxImageSrc(playbackId, thumbnailtime)}
          alt={`${title} thumbnail`}
          fill={true}
          sizes={imgSizesFormat(
            100,
            thumbnailsPerRow > 1 ? 50 : null,
            thumbnailsPerRow === 3 ? 33 : thumbnailsPerRow === 2 ? 50 : null
          )}
          priority={index < 4}
        />
      </div>
      <div
        className={cn(
          'mt-gut-75 flex flex-col gap-gut-50',
          thumbnailsPerRow < 2 &&
            !isPortrait &&
            'lg:grid lg:grid-cols-2 lg:gap-gut',
          isPortrait && thumbnailsPerRow < 2 && 'lg:col-span-3 lg:gap-gut-200'
        )}
      >
        <h3 className="ts-h3 line-clamp-1">{title}</h3>
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-3 gap-gut-25 lg:gap-gut-50',
            thumbnailsPerRow < 2 && 'md:grid-cols-3 md:gap-gut-50'
          )}
        >
          {trimmedCredits.map((credit, i) => (
            <Credit
              key={`${credit.label}-${i}`}
              label={credit.label}
              labelPlural={credit.labelPlural}
              names={credit.names}
              thumbnailsPerRow={thumbnailsPerRow}
            />
          ))}
        </div>
      </div>
      {false && <MuxPlayer playbackId={playbackId ?? ''} poster="" />}
    </div>
  )
}

export function Credit({
  label,
  labelPlural,
  names,
  thumbnailsPerRow,
}: {
  label?: string
  labelPlural?: string
  names?: string[]
  thumbnailsPerRow: number
}) {
  if (!label || !names) return null
  const displayLabel = names.length > 1 ? labelPlural?.trim() || label : label
  return (
    <div
      className={cn(
        'flex leading-120 gap-[.33em] lg:flex-col',
        thumbnailsPerRow < 2
          ? 'max-md:justify-between md:flex-col'
          : 'max-lg:justify-between'
      )}
    >
      <p className="text-body-subtle">{displayLabel}</p>
      <div
        className={cn(
          'flex flex-col gap-[.33em]',
          thumbnailsPerRow < 2
            ? 'max-md:text-right md:text-left'
            : 'max-lg:text-right'
        )}
      >
        {names.map((name, i) => (
          <p key={`${name}-${i}`}>{name}</p>
        ))}
      </div>
    </div>
  )
}
