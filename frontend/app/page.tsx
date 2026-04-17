import FeedControls from '@/components/home/FeedControls'
import HomeIntro from '@/components/home/HomeIntro'
import VideoProject from '@/components/home/VideoProject'
import PageWrapper from '@/components/shared/PageWrapper'
import SiteWidth from '@/components/shared/SiteWidth'
import { AllProjectsQueryResult } from '@/sanity.types'
import { sanityFetch } from '@/sanity/lib/live'
import { allProjectsQuery, homePageQuery } from '@/sanity/lib/queries'

export default async function IndexRoute() {
  const [{ data: home }, { data: allProjects }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
    sanityFetch({ query: allProjectsQuery }),
  ])
  const { subtitle } = home ?? {}
  const hasProjects = allProjects && allProjects.length > 0
  return (
    <PageWrapper showHeaderLogo={false}>
      {false && (
        <HomeIntro subtitle={subtitle || 'is a commercial editorial house.'} />
      )}
      {hasProjects && (
        <SiteWidth className="pt-gut-300">
          <FeedControls />
          <div className="grid grid-cols-6 gap-x-gut gap-y-gut-200">
            {allProjects.map(
              (project: AllProjectsQueryResult[number], index: number) => (
                <VideoProject
                  key={project._id}
                  project={project}
                  index={index}
                />
              )
            )}
          </div>
        </SiteWidth>
      )}
    </PageWrapper>
  )
}
