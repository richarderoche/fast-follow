import { blogDate } from '@/lib/utils'
import { ArticleBySlugQueryResult, BlogPageQueryResult } from '@/sanity.types'
import { imgSizesFormat, resolveHref } from '@/sanity/lib/utils'
import Link from 'next/link'
import ImageBasic from '../shared/ImageBasic'
import Tag from './Tag'

export default function PostHeader({
  data,
}: {
  data:
    | NonNullable<NonNullable<BlogPageQueryResult>['allArticles']>[0]
    | ArticleBySlugQueryResult
}) {
  const {
    title,
    slug,
    tags,
    coverImage,
    coverImageAlt,
    publishDate,
    introText,
    postType,
    externalLink,
  } = data ?? {}
  const isExternal = postType === 'external' && externalLink
  const href = isExternal ? externalLink : resolveHref('article', slug)
  if (!href) return null
  const hasTags = tags && tags.length > 0
  const date = publishDate ? blogDate(publishDate) : null

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="block corner border border-divider h-full"
    >
      {coverImage && (
        <ImageBasic
          image={coverImage}
          alt={coverImageAlt || title}
          sizes={imgSizesFormat(90, 45, 30)}
          ratio={4 / 3}
        />
      )}
      <div className="flex flex-col gap-gut-50 p-gut-50">
        <div className="flex gap-gut items-center justify-between">
          {hasTags && <Tag>{tags.map(({ title }) => title).join(', ')}</Tag>}
          <div className="text-body-subtle ts-p-sm">{date}</div>
        </div>
        <h2 className="ts-h4 text-pretty line-clamp-3">{title}</h2>
        {introText && (
          <p className="ts-p-sm text-pretty line-clamp-3">{introText}</p>
        )}
      </div>
    </Link>
  )
}
