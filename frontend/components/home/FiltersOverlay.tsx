'use client'

import { useAppStore } from '@/lib/store'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import IconCloseSmall from '../icons/IconCloseSmall'
import SiteWidth from '../shared/SiteWidth'

export default function FiltersOverlay({
  filtersOpen,
  onClose,
  children,
}: {
  filtersOpen: boolean
  onClose: () => void
  children: ReactNode
}) {
  const [isRendered, setIsRendered] = useState(filtersOpen)
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const previousActiveRef = useRef<HTMLElement | null>(null)
  const setPauseLenis = useAppStore((s) => s.setPauseLenis)

  const requestClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!filtersOpen) return
    const frame = requestAnimationFrame(() => setIsRendered(true))
    return () => cancelAnimationFrame(frame)
  }, [filtersOpen])

  useGSAP(
    () => {
      const backdrop = backdropRef.current
      const content = contentRef.current
      if (!isRendered || !backdrop || !content) return

      timelineRef.current?.kill()

      if (filtersOpen) {
        gsap.set(backdrop, { opacity: 0 })
        gsap.set(content, { yPercent: -100 })
        timelineRef.current = gsap
          .timeline()
          .to(backdrop, { opacity: 1, duration: 0.2, ease: 'power2.out' })
          .to(content, { yPercent: 0, duration: 0.3, ease: 'power3.out' })
        return
      }

      timelineRef.current = gsap
        .timeline({
          onComplete: () => setIsRendered(false),
        })
        .to(content, { yPercent: -100, duration: 0.26, ease: 'power3.in' })
        .to(backdrop, { opacity: 0, duration: 0.18, ease: 'power2.in' })
    },
    { scope: overlayRef, dependencies: [filtersOpen, isRendered] }
  )

  useEffect(() => {
    if (!filtersOpen) return

    previousActiveRef.current = document.activeElement as HTMLElement | null
    const focusable = contentRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()

      if (e.key !== 'Tab' || !contentRef.current) return

      const focusableElements = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1)

      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousActiveRef.current?.focus()
    }
  }, [filtersOpen, requestClose])

  useEffect(() => {
    if (!isRendered) {
      setPauseLenis(false)
      return
    }

    setPauseLenis(true)
    return () => setPauseLenis(false)
  }, [isRendered, setPauseLenis])

  if (!isRendered) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-1000"
      role="dialog"
      aria-modal="true"
      aria-label="Filters overlay"
      data-lenis-prevent
    >
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close filters"
        onClick={requestClose}
        className="absolute inset-0 bg-black/78 backdrop-blur-xs"
      />
      <div
        ref={contentRef}
        className="overlay-content relative z-10 bg-bg border-b border-body max-h-dvh overflow-y-auto"
      >
        <SiteWidth className="flex justify-end pt-gut sticky top-0">
          <button
            type="button"
            onClick={requestClose}
            className="light-theme flex items-center justify-center size-24 rounded-[2px]"
            aria-label="Close filters"
          >
            <IconCloseSmall className="size-10" />
          </button>
        </SiteWidth>
        {children}
      </div>
    </div>
  )
}
