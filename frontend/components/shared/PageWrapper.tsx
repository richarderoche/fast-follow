'use client'

import { useRef } from 'react'

import { useAppStore } from '@/lib/store'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useIsPresentationTool } from 'next-sanity/hooks'
import ShowHeaderLogo from '../Navbar/ShowHeaderLogo'

export default function PageWrapper({
  children,
  showHeaderLogo = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showHeaderLogo?: boolean }) {
  const { enablePageTransition, setEnablePageTransition } = useAppStore()
  const pageWrapperRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const isPresentationTool = useIsPresentationTool()

  useGSAP(
    () => {
      if (!pageWrapperRef.current) return

      if (isPresentationTool) {
        gsap.set(pageWrapperRef.current, { opacity: 1 })
        return
      }

      if (hasAnimated.current) return

      if (!enablePageTransition) {
        setEnablePageTransition(true)
        return
      }

      hasAnimated.current = true
      gsap.fromTo(
        pageWrapperRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      )
    },
    {
      revertOnUpdate: false,
      dependencies: [enablePageTransition, isPresentationTool],
    }
  )

  return (
    <>
      {showHeaderLogo && <ShowHeaderLogo />}
      <div ref={pageWrapperRef} {...props}>
        {children}
      </div>
    </>
  )
}
