import SiteWidth from '@/components/shared/SiteWidth'
import { sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import IconLogoSymbol from './icons/IconLogoSymbol'
import CurrentYear from './shared/CurrentYear'
import Divider from './shared/Divider'
import SiteGrid from './shared/SiteGrid'

export default async function Footer() {
  const { data } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const { socialIcons, footerLocation } = data || {}

  return (
    <footer className="bottom-0 py-gut-200 md:py-gut mt-gut-400">
      <SiteWidth>
        <Divider />
        <SiteGrid className="mt-gut items-end" yGaps>
          <div className="max-md:my-gut col-span-8 md:col-span-4 lg:col-span-3">
            <IconLogoSymbol className="w-full h-auto" />
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-4 lg:col-start-9 flex gap-gut justify-between">
            {socialIcons && (
              <div className="flex flex-col gap-gut-50">
                {socialIcons.map((link, key) => {
                  return (
                    <a
                      key={key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {link.platform} ↗
                    </a>
                  )
                })}
              </div>
            )}

            <div className="flex flex-col gap-gut-50">
              <p className="whitespace-nowrap">{footerLocation}</p>
              <p className="whitespace-nowrap">
                FastFollow <CurrentYear /> ©
              </p>
            </div>
          </div>
        </SiteGrid>
      </SiteWidth>
    </footer>
  )
}
