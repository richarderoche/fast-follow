import ImageBasic from '@/components/shared/ImageBasic'
import PageWrapper from '@/components/shared/PageWrapper'
import SiteWidth from '@/components/shared/SiteWidth'
import { getTrueSizes } from '@/lib/utils'
import { studioUrl } from '@/sanity/lib/api'
import { sanityFetch } from '@/sanity/lib/live'
import { projectBySlugQuery, slugsByTypeQuery } from '@/sanity/lib/queries'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import type { Metadata, ResolvingMetadata } from 'next'
import { createDataAttribute } from 'next-sanity'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Image, Image as SanityImageType } from 'sanity'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params,
    stega: false,
  })

  const ogImage = urlForOpenGraphImage(
    (project?.ogImage ?? project?.coverImage) as Image
  )
  const noIndex = project?.noIndex ?? false

  return {
    title: project?.seoTitle ?? project?.title,
    description: project?.description ?? (await parent).description,
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
    params: { type: 'project' },
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function ProjectSlugRoute({ params }: Props) {
  const { data } = await sanityFetch({ query: projectBySlugQuery, params })

  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  const dataAttribute =
    data?._id && data._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  // Default to an empty object to allow previews on non-existent documents
  const { coverImage, title } = data ?? {}

  return (
    <PageWrapper>
      <SiteWidth className="mt-gut corner-container">
        <h1 className="ts-h1">{title}</h1>
        <ImageBasic
          data-sanity={dataAttribute?.('coverImage')}
          image={coverImage as SanityImageType}
          alt={`Cover image from ${title}`}
          ratio={16 / 9}
          sizes={getTrueSizes({ mobile: 12, tablet: 12, desktop: 12 })}
          className="my-gut-50 corner"
          priority={true}
        />
      </SiteWidth>
    </PageWrapper>
  )
}
