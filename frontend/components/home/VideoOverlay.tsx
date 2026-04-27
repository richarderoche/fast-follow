'use client'

import { useGSAP } from '@gsap/react'
import { CloseIcon } from '@sanity/icons'
import { FocusTrap } from 'focus-trap-react'
import { useAppStore } from '@/lib/store'
import type { AllProjectsQueryResult } from '@/sanity.types'
import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Project = AllProjectsQueryResult[number]

export default function VideoOverlay({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const [displayProject, setDisplayProject] = useState<Project | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lastOpenedIdRef = useRef<string | null>(null)
  const setPauseLenis = useAppStore((s) => s.setPauseLenis)

  useLayoutEffect(() => {
    if (project) {
      setDisplayProject(project)
    }
  }, [project])

  const resolved = project ?? displayProject

  useGSAP(
    () => {
      const el = overlayRef.current
      if (!el) return

      if (!project && displayProject) {
        lastOpenedIdRef.current = null
        gsap.killTweensOf(el)
        gsap.to(el, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => setDisplayProject(null),
        })
        return
      }

      if (project) {
        if (lastOpenedIdRef.current === project._id) return
        lastOpenedIdRef.current = project._id
        gsap.killTweensOf(el)
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' }
        )
      }
    },
    { dependencies: [project, displayProject] }
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
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [resolved, onClose])

  if (!resolved) return null

  return (
    <FocusTrap active>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-1000 flex flex-col bg-black/80"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-overlay-title"
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-gut right-gut z-10"
          aria-label="Close video"
        >
          <CloseIcon style={{ fontSize: 40, color: 'white' }} />
        </button>
        <div className="flex flex-1 items-center justify-center px-gut">
          <h2
            id="video-overlay-title"
            className="ts-h2 text-center text-white text-balance"
          >
            {resolved.title}
          </h2>
        </div>
      </div>
    </FocusTrap>
  )
}
