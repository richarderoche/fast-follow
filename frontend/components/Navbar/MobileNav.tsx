'use client'

import { useGSAP } from '@gsap/react'
import { CloseIcon, MenuIcon } from '@sanity/icons'
import { FocusTrap } from 'focus-trap-react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import NavLinks from '@/components/shared/NavLinks'
import { useStore } from '@/lib/store'
import { NavItem } from '@/types'

interface NavbarProps {
  headerNav: NavItem[]
}

export default function MobileNav(props: NavbarProps) {
  const { headerNav } = props

  const isMobileNavOpen = useStore((state) => state.isMobileNavOpen)
  const setIsMobileNavOpen = useStore((state) => state.setIsMobileNavOpen)
  const setPauseLenis = useStore((state) => state.setPauseLenis)

  const handleOpenMobileNav = () => {
    setIsMobileNavOpen(true)
    setPauseLenis(true)
  }

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false)
    setPauseLenis(false)
  }

  const handleToggleMobileNav = () => {
    if (isMobileNavOpen) {
      handleCloseMobileNav()
    } else {
      handleOpenMobileNav()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false)
        setPauseLenis(false)
      }
    }
    if (isMobileNavOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileNavOpen, setIsMobileNavOpen, setPauseLenis])

  const navRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.to(navRef.current, {
        x: isMobileNavOpen ? 0 : '-100%',
        duration: isMobileNavOpen ? 0.6 : 0.3,
        ease: 'expo.out',
      })
    },
    { dependencies: [isMobileNavOpen] }
  )

  return (
    <FocusTrap active={isMobileNavOpen}>
      <div className="lg:hidden">
        <button
          onClick={handleToggleMobileNav}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle Menu"
        >
          {isMobileNavOpen ? (
            <CloseIcon style={{ fontSize: 40 }} />
          ) : (
            <MenuIcon style={{ fontSize: 40 }} />
          )}
        </button>

        <nav
          id="mobile-nav"
          ref={navRef}
          className="fixed top-0 bottom-0 left-0 w-9/12 bg-white z-10 overflow-auto -translate-x-full"
          data-lenis-prevent
          role="navigation"
          aria-label="Mobile Navigation"
          inert={!isMobileNavOpen}
        >
          <div>
            <NavLinks
              navItems={headerNav}
              ulClasses="flex flex-col gap-y-4 mt-5 p-4 md:p-8"
              liClasses="text-3xl"
              liActiveClasses="opacity-50"
              onClick={handleCloseMobileNav}
            />
          </div>
        </nav>
      </div>
    </FocusTrap>
  )
}
