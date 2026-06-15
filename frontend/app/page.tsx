import HomeIntro from '@/components/home/HomeIntro'
import VideoFeed from '@/components/home/VideoFeed'
import { SanityVisualEditingProvider } from '@/components/pb/SanityVisualEditingContext'
import PageWrapper from '@/components/shared/PageWrapper'
import { studioUrl } from '@/sanity/lib/api'
import { sanityFetch } from '@/sanity/lib/live'
import { allProjectsQuery, homePageQuery } from '@/sanity/lib/queries'

export default async function IndexRoute() {
  const [{ data: home }, { data: allProjects }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
    sanityFetch({ query: allProjectsQuery }),
  ])
  const { subtitle, _id, _type } = home ?? {}
  const hasProjects = allProjects && allProjects.length > 0
  return (
    <PageWrapper showHeaderLogo={false}>
      <SanityVisualEditingProvider
        documentId={_id ?? null}
        documentType={_type ?? null}
        baseUrl={studioUrl}
      >
        {true && (
          <HomeIntro
            subtitle={subtitle || 'is a commercial editorial house.'}
          />
        )}
        {hasProjects && <VideoFeed projects={allProjects} />}
      </SanityVisualEditingProvider>
    </PageWrapper>
  )
}
