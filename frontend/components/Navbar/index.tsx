import { sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import type { NavItem } from '@/types'
import Link from 'next/link'
import NavLinks from '../shared/NavLinks'
import SiteWidth from '../shared/SiteWidth'
import MobileNav from './MobileNav'
import SkipLink from './SkipLink'

export default async function Navbar() {
  const { data } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const headerNav = data?.headerNav || ([] as NavItem[])
  const siteTitle = data?.title || 'Missing Site Title'

  return (
    <header className="h-header fixed top-0 left-0 w-full z-10">
      <SkipLink />
      <SiteWidth className="h-full flex items-center justify-between gap-x-gut ts-p-md">
        <Link className="text-accent ts-h5" href="/">
          {siteTitle}
        </Link>

        {headerNav && (
          <nav role="navigation" className="h-full py-gut-33">
            {/* Desktop Header Menu */}
            <NavLinks
              navItems={headerNav}
              ulClasses="hidden lg:flex flex-wrap items-center gap-x-1 bg-accent h-full rounded-full px-em"
              liClasses="px-em"
              liActiveClasses="text-bg"
            />
            {/* Mobile Header Menu */}
            <MobileNav headerNav={headerNav} />
          </nav>
        )}
      </SiteWidth>
    </header>
  )
}
