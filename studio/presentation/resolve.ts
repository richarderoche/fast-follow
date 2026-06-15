import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/',
      type: 'home',
    },
    {
      route: '/blog/:slug',
      filter: `_type == "article" && slug.current == $slug`,
    },
    {
      route: '/blog',
      type: 'blog',
    },
    {
      route: '/:slug',
      filter: `_type == "page" && slug.current == $slug`,
    },
  ]),
  locations: {
    home: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Home', href: '/' }],
      }),
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/${doc?.slug}` },
        ],
      }),
    }),
    blog: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Blog', href: '/blog' }],
      }),
    }),
    article: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/blog/${doc?.slug}` },
        ],
      }),
    }),
    videoProject: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Untitled', href: '/' }],
      }),
    }),
  },
}
