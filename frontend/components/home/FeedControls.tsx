'use client'
import { useProjectsStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useRef } from 'react'
import Icon1up from '../icons/Icon1up'
import Icon2up from '../icons/Icon2up'
import Icon3up from '../icons/Icon3up'
import Button from '../shared/Button'
import SiteWidth from '../shared/SiteWidth'
gsap.registerPlugin(ScrollTrigger)

export default function FeedControls({
  onToggleFilters,
}: {
  onToggleFilters: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      gsap.set('.filter-button-container', { y: -20 })
      gsap.to('.filter-button-container', {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          markers: false,
          toggleActions: 'play none none reverse',
        },
      })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="pt-header sticky top-0 z-1 bg-bg">
      <SiteWidth className="flex justify-between items-center py-gut-50">
        <div className="filter-button-container invisible">
          <Button text="Filter" icon="filter" onClick={onToggleFilters} />
        </div>
        <div className="flex gap-gut-50 max-md:hidden">
          <ThumbnailCountButton count={1} />
          <ThumbnailCountButton count={2} />
          <ThumbnailCountButton count={3} />
        </div>
      </SiteWidth>
    </div>
  )
}

function ThumbnailCountButton({ count }: { count: number }) {
  const { thumbnailsPerRow, setThumbnailsPerRow } = useProjectsStore()
  const isActive = thumbnailsPerRow === count
  const IconClassName = 'h-full aspect-square'
  return (
    <button
      className={cn(
        'rounded-full transition-all hover:scale-110',
        isActive ? 'light-theme' : 'bg-bg-subtle',
        count === 3 && 'max-lg:hidden'
      )}
      onClick={() => setThumbnailsPerRow(count)}
    >
      {count === 1 ? (
        <Icon1up className={IconClassName} />
      ) : count === 2 ? (
        <Icon2up className={IconClassName} />
      ) : (
        <Icon3up className={IconClassName} />
      )}
    </button>
  )
}
