import { SITE_MAX_WIDTH } from '@/components/shared/SiteWidth'
import { dataset, projectId } from '@/sanity/lib/api'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'

//
// Image Helpers

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export function urlForOpenGraphImage(image: Image | null | undefined) {
  if (!image?.asset?._ref) {
    return undefined
  }
  return imageBuilder
    ?.image(image)
    ?.width(1200)
    .height(627)
    .fit('crop')
    .auto('format')
    .url()
}

//
// Route Resolver

export function resolveHref(
  documentType?: string,
  slug?: string | null
): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'blog':
      return slug ? `/blog` : undefined
    case 'article':
      return slug ? `/blog/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

export function imgSizesFormat(
  smWidth: number,
  mdWidth?: number | null,
  lgWidth?: number | null
) {
  const tiers: { min?: number; vw: number }[] = []
  if (lgWidth != null) tiers.push({ min: 1024, vw: lgWidth })
  if (mdWidth != null) tiers.push({ min: 768, vw: mdWidth })
  tiers.push({ vw: smWidth })

  while (tiers.length >= 2 && tiers[0].vw === tiers[1].vw) {
    tiers.shift()
  }

  const topVw = tiers[0].vw
  const maxWidthPx = SITE_MAX_WIDTH * (topVw / 100)
  const maxTier = `(min-width: ${SITE_MAX_WIDTH}px) ${maxWidthPx}px`

  const rest = tiers
    .map((t) =>
      t.min != null ? `(min-width: ${t.min}px) ${t.vw}vw` : `${t.vw}vw`
    )
    .join(', ')

  return `${maxTier}, ${rest}`
}
