'use client'

import { useAppStore } from '@/lib/store'
import { cn, cssRatio } from '@/lib/utils'
import type { AllProjectsQueryResult } from '@/sanity.types'
import { useGSAP } from '@gsap/react'
import { FocusTrap } from 'focus-trap-react'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import IconCloseSmall from '../icons/IconCloseSmall'
import Video from '../shared/Video'
import { getAllCredits } from './getAllCredits'
import { Credit } from './VideoProject'

type Project = AllProjectsQueryResult[number]

export default function VideoOverlay({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const [closingProject, setClosingProject] = useState<Project | null>(null)
  const [playing, setPlaying] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoSpaceRef = useRef<HTMLDivElement>(null)
  const lastOpenedIdRef = useRef<string | null>(null)
  const [isWidthLimited, setIsWidthLimited] = useState(true)
  const [activeRatioStr, setActiveRatioStr] = useState('16:9')
  const setPauseLenis = useAppStore((s) => s.setPauseLenis)

  const requestClose = useCallback(() => {
    if (project) {
      setClosingProject(project)
    }
    onClose()
  }, [project, onClose])

  const resolved = project ?? closingProject
  const allCredits = resolved ? getAllCredits(resolved) : []
  const ratioStr = resolved?.video?.ratio ?? '16:9'

  useEffect(() => {
    setActiveRatioStr(ratioStr)
  }, [ratioStr])

  useEffect(() => {
    const space = videoSpaceRef.current
    if (!space) return

    const [wRaw, hRaw] = activeRatioStr.split(/[:/]/).map(Number)
    const videoRatio = wRaw > 0 && hRaw > 0 ? wRaw / hRaw : 16 / 9

    const updateLimitMode = () => {
      const containerWidth = space.clientWidth
      const containerHeight = space.clientHeight
      if (!containerWidth || !containerHeight) return

      const containerRatio = containerWidth / containerHeight
      setIsWidthLimited(containerRatio <= videoRatio)
    }

    updateLimitMode()
    const observer = new ResizeObserver(updateLimitMode)
    observer.observe(space)
    return () => observer.disconnect()
  }, [activeRatioStr])

  useGSAP(
    () => {
      const el = overlayRef.current
      if (!el) return

      if (!project && closingProject) {
        setPlaying(false)
        gsap.killTweensOf(el)
        gsap.to(el, {
          opacity: 0,
          duration: 0.35,
          ease: 'power3.in',
          onComplete: () => {
            setClosingProject(null)
            lastOpenedIdRef.current = null
          },
        })
        return
      }

      if (project) {
        if (lastOpenedIdRef.current === project._id) return
        lastOpenedIdRef.current = project._id
        gsap.killTweensOf([el])
        gsap
          .timeline({
            onComplete: () => setPlaying(true),
          })
          .from(el, { opacity: 0, duration: 0.35, ease: 'power2.out' })
          .from('.overlay-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: 'power3.out',
          })
      }
    },
    { scope: overlayRef, dependencies: [project, closingProject] }
  )

  useEffect(() => {
    if (!resolved) {
      setPauseLenis(false)
      return
    }
    setPauseLenis(true)
    return () => setPauseLenis(false)
  }, [resolved, setPauseLenis])

  useEffect(() => {
    if (!resolved) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [resolved, requestClose])

  if (!resolved) return null

  return (
    <FocusTrap active>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-1000 bg-black/88 backdrop-blur-sm p-gut"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-overlay-title"
        data-lenis-prevent
      >
        <div className="overlay-content flex flex-col gap-gut h-full">
          <div className="flex justify-between gap-gut-50">
            <h2 id="video-overlay-title" className="ts-h4">
              {resolved.title}
            </h2>
            <button
              type="button"
              onClick={requestClose}
              className="light-theme flex items-center justify-center size-24 rounded-[2px]"
              aria-label="Close video"
            >
              <IconCloseSmall className="size-10" />
            </button>
          </div>
          <div ref={videoSpaceRef} className="grow relative">
            <div className="absolute inset-0 flex items-center justify-center corner-container">
              <div
                className={cn(
                  'relative corner overflow-hidden max-w-full max-h-full',
                  isWidthLimited ? 'w-full h-auto' : 'w-auto h-full'
                )}
                style={{
                  aspectRatio: cssRatio(activeRatioStr),
                }}
              >
                <Video
                  playbackId={resolved.video?.playbackId ?? undefined}
                  className="absolute inset-0 h-full w-full object-contain"
                  useManualIsInView
                  manualIsInView={playing}
                  disablePoster
                  onLoadedMetadata={(e) => {
                    const { videoWidth, videoHeight } = e.currentTarget
                    if (!videoWidth || !videoHeight) return
                    const nextRatio = `${videoWidth}:${videoHeight}`
                    setActiveRatioStr((prev) =>
                      prev === nextRatio ? prev : nextRatio
                    )
                  }}
                  loop
                  controls
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-gut-25 md:grid-cols-3 md:gap-gut lg:grid-cols-5">
            {allCredits.slice(0, 5).map((credit, i) => (
              <Credit
                key={`overlay-${credit.label}-${i}`}
                label={credit.label}
                labelPlural={credit.labelPlural}
                names={credit.names}
                thumbnailsPerRow={1}
              />
            ))}
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}
