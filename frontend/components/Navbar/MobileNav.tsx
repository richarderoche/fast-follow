'use client'

import { useGSAP } from '@gsap/react'
import { FocusTrap } from 'focus-trap-react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

import NavLinks from '@/components/shared/NavLinks'
import { useAppStore } from '@/lib/store'
import { SettingsQueryResult } from '@/sanity.types'
import IconNavClose from '../icons/IconNavClose'
import IconNavOpen from '../icons/IconNavOpen'
import Button from '../shared/Button'
import Contact from './Contact'

export default function MobileNav({ data }: { data: SettingsQueryResult }) {
  const { headerNav } = data || {}

  const [isOpen, setIsOpen] = useState(false)
  const [navColumn, setNavColumn] = useState(1)
  const backdropRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
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

  const handleSetNavColumn = (column: number) => {
    setNavColumn(column)
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
        onComplete: () => {
          setNavColumn(1)
        },
      })
      gsap.to(backdropRef.current, {
        autoAlpha: isOpen ? 1 : 0,
        duration: isOpen ? 0.6 : 0.3,
        ease: 'expo.out',
      })
    },
    { dependencies: [isOpen] }
  )

  useGSAP(
    () => {
      if (navColumn === 2) {
        gsap.to(contentRef.current, {
          x: '-50%',
          duration: 0.6,
          ease: 'expo.out',
        })
      } else {
        gsap.to(contentRef.current, {
          x: '0%',
          duration: 0.6,
          ease: 'expo.out',
        })
      }
    },
    { dependencies: [navColumn] }
  )

  return (
    <FocusTrap active={isOpen}>
      <div className="lg:hidden pointer-events-auto">
        <button
          ref={backdropRef}
          type="button"
          aria-label="Close contact"
          onClick={handleClose}
          className="fixed inset-0 bg-black/78 backdrop-blur-xs"
        />
        <button
          type="button"
          onClick={handleToggle}
          className="relative z-1000"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <IconNavClose className="size-32" />
          ) : (
            <IconNavOpen className="size-32" />
          )}
        </button>

        <nav
          id="mobile-nav"
          ref={navRef}
          className="fixed top-0 bottom-0 right-0 w-9/10 md:w-1/2 bg-bg z-999 overflow-y-auto overflow-x-hidden py-header translate-x-full border-l border-divider"
          data-lenis-prevent
          role="navigation"
          aria-label="Mobile Navigation"
          inert={!isOpen}
        >
          <div ref={contentRef} className="grid grid-cols-2 w-2/1">
            <div className="px-gut mt-gut-200">
              <NavLinks
                navItems={headerNav || []}
                ulClasses="flex flex-col gap-gut-200"
                liClasses="ts-h1"
                onClick={handleClose}
              />
              <div className="border-t border-divider pt-gut-200 mt-gut-200">
                <button
                  type="button"
                  className="ts-h1"
                  onClick={() => handleSetNavColumn(2)}
                >
                  Contact →
                </button>
              </div>
            </div>
            <div className="px-gut mt-gut-200">
              <Button
                className="mb-gut-200"
                text="← Back"
                onClick={() => handleSetNavColumn(1)}
                outline={true}
              />
              <Contact data={data} />
            </div>
          </div>
        </nav>
      </div>
    </FocusTrap>
  )
}
