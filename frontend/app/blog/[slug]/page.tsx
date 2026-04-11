import PageBuilder from '@/components/pb/PageBuilder'
import ImageBasic from '@/components/shared/ImageBasic'
import PageWrapper from '@/components/shared/PageWrapper'
import SiteGrid from '@/components/shared/SiteGrid'
import SiteWidth from '@/components/shared/SiteWidth'
import Tag from '@/components/shared/Tag'
import { blogDate, cn } from '@/lib/utils'
import { sanityFetch } from '@/sanity/lib/live'
import { articleBySlugQuery, slugsByTypeQuery } from '@/sanity/lib/queries'
import { imgSizesFormat, urlForOpenGraphImage } from '@/sanity/lib/utils'
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
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: noIndex,
      },
    },
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
  // Shared fields
  const {
    coverImage,
    coverImageAlt,
    externalLink,
    introText,
    postType,
    publishDate,
    tags,
    title,
  } = data ?? {}

  const shortHeading = (title?.length || 0) < 80
  const hasTags = tags && tags.length > 0
  let headingTsClass = ''
  let date = '' as string | null

  if (postType === 'external') {
    if (!externalLink) {
      notFound()
    }
    return redirect(externalLink)
  }
  date = publishDate ? blogDate(publishDate as string) : null
  headingTsClass = shortHeading ? 'ts-h2' : 'ts-h3'

  return (
    <PageWrapper className="pt-header">
      {/* Header */}
      <SiteWidth className="pt-gut-300 pb-gut-300">
        <SiteGrid yGaps={true} looseColSpacing={true}>
          <div className="corner-container col-span-12 lg:col-span-6">
            <ImageBasic
              image={coverImage as Image}
              alt={coverImageAlt || title}
              sizes={imgSizesFormat(90, null, 40)}
              ratio={4 / 3}
              priority={true}
              className="corner"
            />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="flex gap-gut items-center justify-between mb-gut">
              {hasTags && (
                <Tag>{tags.map(({ title }) => title).join(', ')}</Tag>
              )}
              <div className="text-body-subtle ts-p-sm">{date}</div>
            </div>
            <h1 className={cn(headingTsClass, 'text-balance')}>{title}</h1>
            {introText && (
              <div className="ts-p-lg text-balance text-body-subtle mt-gut">
                {introText}
              </div>
            )}
          </div>
        </SiteGrid>
      </SiteWidth>

      {/* Page Builder */}
      <PageBuilder data={data} firstPbSectionKey={'not-applicable'} />
    </PageWrapper>
  )
}
