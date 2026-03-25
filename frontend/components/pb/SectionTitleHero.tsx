'use client'

import { cn, getGridClasses, getOuterSettings } from '@/lib/utils'
import { PbTitleSection } from '@/sanity.types'

import ImageBasic from '../shared/ImageBasic'
import SiteGrid from '../shared/SiteGrid'
import SiteWidth from '../shared/SiteWidth'

export default function SectionTitleHero({
  section,
  isFirst,
}: {
  section: PbTitleSection
  isFirst: boolean
}) {
  const { rowWidth, titleMode, title, image, heroImageAltText } = section
  const isHero = titleMode === 'hero'
  const hasHero = isHero && image?.asset?._ref

  // Prep attributes
  const outerSettings = getOuterSettings(rowWidth)
  const outerClasses = outerSettings ? getGridClasses(outerSettings) : ''
  const shortHeading = (title?.length || 0) < 90
  const HeadingTag = isFirst ? 'h1' : 'h2'
  let headingTsClass: string
  switch (true) {
    case rowWidth === 12:
      headingTsClass = 'ts-h1'
      break
    case shortHeading && rowWidth === 10:
      headingTsClass = 'ts-h1'
      break
    case rowWidth === 10:
      headingTsClass = 'ts-h2'
      break
    case shortHeading && rowWidth === 8:
      headingTsClass = 'ts-h2'
      break
    default:
      headingTsClass = 'ts-h3'
  }

  return (
    <div className="pb-gut-200">
      {hasHero && (
        <ImageBasic
          image={image}
          alt={heroImageAltText || ''}
          sizes="100vw"
          priority={isFirst ? true : false}
          ratio={2.5}
          className={cn(!isFirst && 'pt-gut-400')}
        />
      )}
      {title && (
        <SiteWidth className={isHero || isFirst ? 'pt-gut-300' : 'pt-gut-400'}>
          <SiteGrid>
            <div className={outerClasses}>
              <HeadingTag className={cn(headingTsClass, 'text-balance')}>
                {title}
              </HeadingTag>
            </div>
          </SiteGrid>
        </SiteWidth>
      )}
    </div>
  )
}
