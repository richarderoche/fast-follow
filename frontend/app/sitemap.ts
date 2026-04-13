import { sanityFetch } from '@/sanity/lib/live'
import { sitemapByTypeQuery } from '@/sanity/lib/queries'
import { resolveHref } from '@/sanity/lib/utils'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = 'https://www.fastfollowpost.com/'
  const home = await sanityFetch({
    query: sitemapByTypeQuery,
    params: { type: 'home' },
    stega: false,
    perspective: 'published',
  })
  const pages = await sanityFetch({
    query: sitemapByTypeQuery,
    params: { type: 'page' },
    stega: false,
    perspective: 'published',
  })
  const blog = await sanityFetch({
    query: sitemapByTypeQuery,
    params: { type: 'blog' },
    stega: false,
    perspective: 'published',
  })
  const articles = await sanityFetch({
    query: sitemapByTypeQuery,
    params: { type: 'article' },
    stega: false,
    perspective: 'published',
  })

  const sitemap = [
    {
      url: baseURL,
      lastModified: home.data[0].updatedAt,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  blog.data.map(({ slug, updatedAt }) => {
    sitemap.push(smObject(baseURL, slug, 'blog', 'yearly', 0.8, updatedAt))
  })

  pages.data.map(({ slug, updatedAt }) => {
    sitemap.push(smObject(baseURL, slug, 'page', 'yearly', 0.8, updatedAt))
  })

  articles.data.map(({ slug, updatedAt, postType }) => {
    if (postType === 'internal') {
      sitemap.push(smObject(baseURL, slug, 'article', 'yearly', 0.6, updatedAt))
    }
  })

  return sitemap as MetadataRoute.Sitemap
}

function smObject(
  baseURL: string,
  slug: string | null,
  type = 'page',
  freq:
    | 'yearly'
    | 'monthly'
    | 'weekly'
    | 'daily'
    | 'hourly'
    | 'never' = 'yearly',
  prio: number = 0.8,
  updatedAt: string
) {
  const url = baseURL + resolveHref(type, slug)

  return {
    url: url,
    lastModified: updatedAt,
    changeFrequency: freq,
    priority: prio,
  }
}
