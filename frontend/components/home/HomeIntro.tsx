'use client'
import SiteWidth from '@/components/shared/SiteWidth'
import { useSize } from '@/lib/useSize'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'

export default function HomeIntro({ subtitle }: { subtitle: string }) {
  const [headerLogoTop, setHeaderLogoTop] = useState(0)
  const [setSizeNode, containerSize] = useSize()
  const introRootRef = useRef<HTMLDivElement>(null)

  const setIntroRootRef = useCallback(
    (el: HTMLDivElement | null) => {
      setSizeNode(el)
      introRootRef.current = el
    },
    [setSizeNode]
  )
  const [logoRatio, setlogoRatio] = useState(1)
  const containerWidth = containerSize.width

  const handleSetHeaderLogoTop = useEffectEvent((value: number) => {
    setHeaderLogoTop(value)
  })

  const handleSetlogoRatio = useEffectEvent((value: number) => {
    setlogoRatio(value)
  })

  useEffect(() => {
    const headerLogo = document.getElementById('header-logo')
    const introLogo = document.getElementById('intro-logo')
    if (!introLogo || !headerLogo) return

    const offset = headerLogo?.getBoundingClientRect().top + window.scrollY
    handleSetHeaderLogoTop(offset)

    const scaleDifference =
      headerLogo.getBoundingClientRect().width /
      introLogo.getBoundingClientRect().width
    handleSetlogoRatio(scaleDifference)
  }, [containerWidth])

  gsap.registerPlugin(ScrollTrigger)

  useGSAP(
    () => {
      if (!introRootRef.current) return
      gsap.set('.home-intro-text', { scale: 1, y: '100%' })
      gsap.set('.home-intro-subtitle', { opacity: 1 })
      gsap.set(introRootRef.current, { opacity: 1 })
      gsap.to('.home-intro-text', {
        scrollTrigger: {
          trigger: introRootRef.current,
          start: 'top top',
          end: 'bottom 60',
          scrub: true,
          markers: false,
        },
        scale: logoRatio,
        y: 0,
        ease: 'linear',
      })
      gsap.to('.home-intro-subtitle', {
        scrollTrigger: {
          trigger: introRootRef.current,
          start: 'top top',
          end: 'bottom 60',
          scrub: true,
          markers: false,
        },
        opacity: 0,
        ease: 'linear',
      })
    },
    {
      scope: introRootRef,
      dependencies: [headerLogoTop, logoRatio],
      revertOnUpdate: true,
    }
  )

  return (
    <div
      className="ts-header-logo-h1 h-[8em] md:h-[5em] mb-gut opacity-0"
      ref={setIntroRootRef}
    >
      <div className="fixed top-0 left-0 w-full z-10 pointer-events-none">
        <SiteWidth>
          <div
            className="h-full"
            style={{ transform: `translateY(${headerLogoTop}px)` }}
          >
            <div className="home-intro-text text-balance origin-top-left">
              <span id="intro-logo" className="pointer-events-default">
                <span className="font-bold">Fast</span>
                <span>Follow</span>
              </span>
              <span className="home-intro-subtitle font-bold text-display-subtle">
                {' '}
                {subtitle}
              </span>
            </div>
          </div>
        </SiteWidth>
      </div>
    </div>
  )
}
