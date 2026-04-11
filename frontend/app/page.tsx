import HomeIntro from '@/components/home/HomeIntro'
import PageBuilder from '@/components/pb/PageBuilder'
import PageWrapper from '@/components/shared/PageWrapper'
import StyleGuide from '@/components/shared/StyleGuide'
import { sanityFetch } from '@/sanity/lib/live'
import { homePageQuery } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'

export default async function IndexRoute() {
  const { data } = await sanityFetch({ query: homePageQuery })
  const { subtitle } = data ?? {}

  if (!data) {
    notFound()
  }

  return (
    <PageWrapper showHeaderLogo={false}>
      <HomeIntro subtitle={subtitle || 'is a commercial editorial house.'} />
      <StyleGuide />
      <PageBuilder data={data} firstPbSectionKey={'not-applicable'} />
    </PageWrapper>
  )
}
