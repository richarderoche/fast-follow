'use client'

import { useGSAP } from '@gsap/react'
import { FocusTrap } from 'focus-trap-react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

import { useAppStore } from '@/lib/store'
import Button from '../shared/Button'

export default function DesktopContact({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const backdropRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const setPauseLenis = useAppStore((state) => state.setPauseLenis)

  const handleOpen = () => {
    setIsOpen(true)
    setPauseLenis(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setPauseLenis(false)
  }

  const handleToggle = () => {
    if (isOpen) {
      handleClose()
    } else {
      handleOpen()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setPauseLenis(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, setIsOpen, setPauseLenis])

  useGSAP(
    () => {
      gsap.to(navRef.current, {
        x: isOpen ? '0%' : '100%',
        duration: isOpen ? 0.6 : 0.3,
        ease: 'expo.out',
      })
      gsap.to(backdropRef.current, {
        autoAlpha: isOpen ? 1 : 0,
        duration: isOpen ? 0.6 : 0.3,
        ease: 'expo.out',
      })
    },
    { dependencies: [isOpen] }
  )

  return (
    <FocusTrap active={isOpen}>
      <div className="max-lg:hidden pointer-events-auto">
        <button
          ref={backdropRef}
          type="button"
          aria-label="Close contact"
          onClick={handleClose}
          className="fixed inset-0 bg-black/78 backdrop-blur-xs"
        />
        <Button
          text="Contact"
          icon={isOpen ? 'close' : 'close-spacer'}
          onClick={handleToggle}
          className="relative z-1000"
          outline={true}
          aria-expanded={isOpen}
          aria-controls="desktop-contact-nav"
          aria-label="Toggle Contact"
        />

        <nav
          id="desktop-contact-nav"
          ref={navRef}
          className="fixed top-0 bottom-0 right-0 w-1/3 bg-bg z-999 overflow-auto py-header translate-x-full border-l border-divider"
          data-lenis-prevent
          role="navigation"
          aria-label="Desktop Contact Navigation"
          inert={!isOpen}
        >
          {children}
        </nav>
      </div>
    </FocusTrap>
  )
}
