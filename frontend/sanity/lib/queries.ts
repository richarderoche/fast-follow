import { defineQuery } from 'next-sanity'

// PARTIALS
const seo = `
  "seoTitle": seo.seoTitle,
  "description": seo.description,
  "ogImage": seo.image,
  "noIndex": seo.hideFromSearchEngines
`

const page = `
  "type": _type,
  "slug": slug.current,
  title
`

const link = `
  ...,
  "page": page->{
    ${page},
  }
`

const tags = `
  "tags": tags[]->{
    ...,
    "slug": slug.current,
  }
`

const portableText = `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      "slug": reference->slug,
      "type": reference->_type
    }
  }
`

const pbButton = `
  ...,
  sitePage {
    ${link},
  },
  externalLink {
    ${link},
  },
  fileLink {
    ...,
    "url": file.asset->url,
  },
`

const pbBlocks = `
  ...,
  _type == "pbBlockText" => {
    ...,
    textContent[]{
      ${portableText}
    }
  },
  _type == "pbBlockButton" => {
    ${pbButton}
  },
`

const pb = `
  pbSections[]{
    ...,
    _type == "pbGridMulti" => {
      columns[]{
        ...,
        pbBlocks[]{
          ${pbBlocks}
        }
      }
    },
    _type == "pbGridSingle" => {
      ...,
      pbBlocks[]{
        ${pbBlocks}
      }
    },
    _type == "pbGridDouble" => {
      ...,
      columnOne {
        ...,
        pbBlocks[]{
          ${pbBlocks}
        }
      },
      columnTwo {
        ...,
        pbBlocks[]{
          ${pbBlocks}
        }
      }
    },
  }
`

// QUERIES
export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    ...,
    ${pb},
    showcaseProjects[]{
      _key,
      "project": @->{
        _id,
        _type,
        coverImage,
        "slug": slug.current,
        title,
      }
    },
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    ${pb},
    ${seo},
  }
`)

export const metadataBySlugQuery = defineQuery(`
  *[_type == $type && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    ${seo},
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    ...,
  }
`)

export const blogPageQuery = defineQuery(`
  *[_type == "blog"][0] {
    ...,
    "allArticles": *[_type == "article"] | order(publishDate desc) {
      title,
      "slug": slug.current,
      ${tags},
      coverImage,
      coverImageAlt,
      publishDate,
      introText,
      postType,
      externalLink,
    },
    ${pb},
    ${seo},
  }
`)

export const articleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    ${tags},
    ${pb},
    ${seo},
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current, postType}
`)

export const sitemapByTypeQuery = defineQuery(`
  *[_type == $type]{"slug": slug.current, "updatedAt": _updatedAt, postType}
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    ...,
    "headerNav": headerNav.navItems[]{
      ${link},
    },
    ${seo},
  }
`)

export const scriptsQuery = defineQuery(`
  *[_type == "settings"][0]{
    "gtmId": googletagmanagerID,
    customScripts,
  }
`)
