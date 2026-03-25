import { sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import type { NavItem } from '@/types'
import NavLinks from '../shared/NavLinks'
import SiteWidth from '../shared/SiteWidth'
import HeaderLogo from './HeaderLogo'
import MobileNav from './MobileNav'
import SkipLink from './SkipLink'

export default async function Navbar() {
  const { data } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const headerNav = data?.headerNav || ([] as NavItem[])

  return (
    <header className="h-header fixed top-0 left-0 w-full z-10 pointer-events-none">
      <SkipLink />
      <SiteWidth className="h-full flex items-end justify-between gap-x-gut">
        <HeaderLogo />

        {headerNav && (
          <nav role="navigation" className="flex items-center gap-x-gut">
            {/* Desktop Header Menu */}
            <NavLinks
              navItems={headerNav}
              ulClasses="hidden lg:flex flex-wrap items-center gap-x-1 bg-bg-subtle rounded-full p-2 ts-h5 pointer-events-auto"
              liClasses="rounded-full hover:bg-divider/20 transition-colors"
              liActiveClasses="bg-body text-bg pointer-events-none"
              linkClasses="px-[.8em] py-[.25em] flex w-fit items-center"
            />
            <div className="max-lg:hidden flex flex-wrap items-center gap-x-1 bg-body rounded-full p-1 pointer-events-auto">
              <button className="px-[.8em] py-[.25em] flex w-fit items-center bg-bg rounded-full ts-h5">
                <span>Contact</span>
              </button>
            </div>
            {/* Mobile Header Menu */}
            <MobileNav headerNav={headerNav} />
          </nav>
        )}
      </SiteWidth>
    </header>
  )
}
