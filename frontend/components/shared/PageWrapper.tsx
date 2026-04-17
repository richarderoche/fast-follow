'use client'

import { useRef } from 'react'

import { useAppStore } from '@/lib/store'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ShowHeaderLogo from '../Navbar/ShowHeaderLogo'

export default function PageWrapper({
  children,
  showHeaderLogo = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showHeaderLogo?: boolean }) {
  const { enablePageTransition, setEnablePageTransition } = useAppStore()
  const pageWrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (enablePageTransition && pageWrapperRef.current) {
      gsap.fromTo(
        pageWrapperRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      )
    } else if (!enablePageTransition && pageWrapperRef.current) {
      setEnablePageTransition(true)
    }
  })

  return (
    <>
      {showHeaderLogo && <ShowHeaderLogo />}
      <div ref={pageWrapperRef} {...props}>
        {children}
      </div>
    </>
  )
}
