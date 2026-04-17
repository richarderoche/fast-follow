import Tag from '@/components/blog/Tag'
import ImageBasic from '@/components/shared/ImageBasic'
import SiteGrid from '@/components/shared/SiteGrid'
import { blogDate, cn, imgSizesFormat } from '@/lib/utils'
import { ArticleBySlugQueryResult, BlogPageQueryResult } from '@/sanity.types'
import { resolveHref } from '@/sanity/lib/utils'
import Button from '../shared/Button'

export default function PostHeader({
  data,
  showLink = true,
}: {
  data:
    | NonNullable<NonNullable<BlogPageQueryResult>['allArticles']>[0]
    | ArticleBySlugQueryResult
  showLink?: boolean
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
  const headingTsClass = (title?.length || 0) < 80 ? 'ts-h2' : 'ts-h3'

  return (
    <SiteGrid yGaps={true} looseColSpacing={true}>
      <div className="corner-container col-span-12 lg:col-span-6">
        {coverImage && (
          <ImageBasic
            image={coverImage}
            alt={coverImageAlt || title}
            sizes={imgSizesFormat(90, null, 45)}
            ratio={4 / 3}
            priority={true}
            className="corner"
          />
        )}
      </div>

      <div className="col-span-12 lg:col-span-6">
        <div className="flex gap-gut items-center justify-between mb-gut">
          {hasTags && <Tag>{tags.map(({ title }) => title).join(', ')}</Tag>}
          <div className="text-body-subtle ts-p-sm">{date}</div>
        </div>
        <h1 className={cn(headingTsClass, 'text-balance')}>{title}</h1>
        {introText && (
          <div className="ts-p-lg text-balance text-body-subtle mt-gut">
            {introText}
          </div>
        )}
        {showLink && (
          <div className="mt-gut">
            <Button path={href} text="Read Article" />
          </div>
        )}
      </div>
    </SiteGrid>
  )
}
