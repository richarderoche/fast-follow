import BlogFeed from '@/components/blog/BlogFeed'
import PageBuilder from '@/components/pb/PageBuilder'
import PageWrapper from '@/components/shared/PageWrapper'
import { getFirstSectionInfo, getMetadataRobots } from '@/lib/utils'
import { sanityFetch } from '@/sanity/lib/live'
import {
  blogPageQuery,
  metadataBySlugQuery,
  slugsByTypeQuery,
} from '@/sanity/lib/queries'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: meta } = await sanityFetch({
    query: metadataBySlugQuery,
    params: { type: 'blog', slug: 'blog' },
    stega: false,
  })

  const ogImage = urlForOpenGraphImage(meta?.ogImage)
  const noIndex = meta?.noIndex ?? false

  return {
    title: meta?.seoTitle ?? meta?.title,
    description: meta?.description ?? (await parent).description,
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
    params: { type: 'blog' },
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function BlogRoute() {
  const { data } = await sanityFetch({ query: blogPageQuery })

  if (!data) {
    notFound()
  }
  const { allArticles, postsPerLoad = 6 } = data ?? {}
  const { firstIsHero, firstPbSectionKey } = getFirstSectionInfo(data)

  return (
    <PageWrapper className={firstIsHero ? '' : 'pt-header'}>
      <PageBuilder data={data} firstPbSectionKey={firstPbSectionKey ?? ''} />
      {allArticles && allArticles.length > 0 && (
        <BlogFeed allArticles={allArticles} postsPerLoad={postsPerLoad} />
      )}
    </PageWrapper>
  )
}
