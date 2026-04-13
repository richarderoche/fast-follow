import PostHeader from '@/components/blog/PostHeader'
import PageBuilder from '@/components/pb/PageBuilder'
import PageWrapper from '@/components/shared/PageWrapper'
import SiteWidth from '@/components/shared/SiteWidth'
import { getMetadataRobots } from '@/lib/utils'
import { sanityFetch } from '@/sanity/lib/live'
import { articleBySlugQuery, slugsByTypeQuery } from '@/sanity/lib/queries'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import type { Metadata, ResolvingMetadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import type { Image } from 'sanity'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: article } = await sanityFetch({
    query: articleBySlugQuery,
    params,
    stega: false,
  })

  const ogImage = urlForOpenGraphImage(
    (article?.ogImage ?? article?.coverImage) as Image
  )
  const noIndex = article?.noIndex ?? false

  return {
    title: article?.seoTitle ?? article?.title,
    description:
      (article?.description || article?.introText) ??
      (await parent).description,
    openGraph: {
      images: ogImage
        ? [ogImage]
        : [...((await parent).openGraph?.images ?? [])],
    },
    robots: getMetadataRobots(noIndex),
  }
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: slugsByTypeQuery,
    params: { type: 'article' },
    stega: false,
    perspective: 'published',
  })
  const internalArticles = data.filter(
    (article) => article.postType === 'internal'
  )
  return internalArticles
}

export default async function ArticleSlugRoute({ params }: Props) {
  const { data } = await sanityFetch({ query: articleBySlugQuery, params })

  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }
  const { externalLink, postType } = data ?? {}

  if (postType === 'external') {
    if (!externalLink) {
      notFound()
    }
    return redirect(externalLink)
  }

  return (
    <PageWrapper className="pt-header">
      <SiteWidth className="pt-gut-300 pb-gut-300">
        <PostHeader data={data} showLink={false} />
      </SiteWidth>

      <PageBuilder data={data} firstPbSectionKey={'not-applicable'} />
    </PageWrapper>
  )
}
