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
import Image from 'next/image'
import IconPlayVideo from '../icons/IconPlayVideo'

export default function VideoProject({
  project,
  index,
  onOpen,
}: {
  project: AllProjectsQueryResult[number]
  index: number
  onOpen?: () => void
}) {
  const { video, title, thumbnailtime } = project
  const { playbackId, ratio } = video ?? {}
  const { thumbnailsPerRow = 2 } = useProjectsStore()
  const allCredits = getAllCredits(project)
  const trimmedCredits = allCredits.slice(0, 3)
  const isPortrait = getIsPortrait(ratio ?? '16:9')
  const displayOriginalRatio = thumbnailsPerRow === 1
  const portaitLayout = displayOriginalRatio && isPortrait

  if (!playbackId) return null

  return (
    <div
      key={project._id}
      className={cn(
        'corner-container col-span-6 text-balance',
        thumbnailsPerRow > 1 && 'md:col-span-3',
        thumbnailsPerRow === 3 && 'lg:col-span-2',
        portaitLayout &&
          'md:grid md:grid-cols-2 md:gap-gut lg:col-span-5 lg:grid-cols-5 lg:gap-gut-200 md:items-center'
      )}
    >
      <button
        className={cn(
          'w-full corner relative group cursor-pointer',
          portaitLayout && 'lg:col-span-2'
        )}
        style={{
          aspectRatio: cssRatio(
            displayOriginalRatio ? (ratio ?? '16:9') : '3:2'
          ),
        }}
        onClick={() => onOpen?.()}
      >
        <Image
          src={getMuxImageSrc(playbackId, thumbnailtime)}
          alt={`${title} thumbnail`}
          fill={true}
          className="object-cover object-center group-hover:scale-105 motion-safe:transition-transform duration-300"
          sizes={imgSizesFormat(
            100,
            thumbnailsPerRow > 1 ? 50 : null,
            thumbnailsPerRow === 3 ? 33 : thumbnailsPerRow === 2 ? 50 : null
          )}
          priority={index < 4}
        />
        <IconPlayVideo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-60 text-black/50 group-hover:text-black/80 transition-colors duration-300" />
      </button>
      <div
        className={cn(
          'mt-gut-75 flex flex-col gap-gut-50',
          displayOriginalRatio &&
            !isPortrait &&
            'lg:grid lg:grid-cols-2 lg:gap-gut',
          portaitLayout && 'lg:col-span-3 md:gap-gut-200'
        )}
      >
        <h3
          className={cn(
            'ts-h3 line-clamp-1',
            portaitLayout && 'md:line-clamp-2'
          )}
        >
          {title}
        </h3>
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-3 gap-gut-25 lg:gap-gut-50',
            !isPortrait &&
              displayOriginalRatio &&
              'md:grid-cols-3 md:gap-gut-50',
            portaitLayout && 'md:grid-cols-2 md:gap-gut'
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
