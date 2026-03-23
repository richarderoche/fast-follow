import OptimisticSortOrder from '@/components/OptimisticSortOrder/index.client'
import PageBuilder from '@/components/pb/PageBuilder'
import { ProjectListItem } from '@/components/ProjectListItem'
import PageWrapper from '@/components/shared/PageWrapper'
import SiteGrid from '@/components/shared/SiteGrid'
import SiteWidth from '@/components/shared/SiteWidth'
import StyleGuide from '@/components/shared/StyleGuide'
import { getFirstSectionInfo } from '@/lib/utils'
import { studioUrl } from '@/sanity/lib/api'
import { sanityFetch } from '@/sanity/lib/live'
import { homePageQuery } from '@/sanity/lib/queries'
import { resolveHref } from '@/sanity/lib/utils'
import { createDataAttribute } from 'next-sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function IndexRoute() {
  const { data } = await sanityFetch({ query: homePageQuery })

  if (!data) {
    notFound()
  }

  const { firstIsHero, firstPbSectionKey } = getFirstSectionInfo(data)
  const { showcaseProjects } = data ?? {}

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return (
    <PageWrapper className={firstIsHero ? '' : 'pt-header'}>
      <StyleGuide />
      <PageBuilder data={data} firstPbSectionKey={firstPbSectionKey ?? ''} />
      {showcaseProjects && showcaseProjects.length > 0 && (
        <SiteWidth className="my-gut">
          <SiteGrid>
            <OptimisticSortOrder id={data?._id} path={'showcaseProjects'}>
              {showcaseProjects.map((item) => {
                const project = item.project
                const href = resolveHref(project?._type, project?.slug)
                if (!href) {
                  return null
                }
                return (
                  <div
                    className="col-span-12 md:col-span-6 lg:col-span-4"
                    key={item._key}
                    data-sanity={dataAttribute?.([
                      'showcaseProjects',
                      { _key: item._key },
                    ])}
                  >
                    <Link href={href}>
                      <ProjectListItem project={project} />
                    </Link>
                  </div>
                )
              })}
            </OptimisticSortOrder>
          </SiteGrid>
        </SiteWidth>
      )}
    </PageWrapper>
  )
}
