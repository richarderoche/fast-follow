import article from './documents/article'
import page from './documents/page'
import project from './documents/project'
import redirect from './documents/redirect'
import tag from './documents/tag'
import navExternal from './objects/navExternal'
import navLinks from './objects/navLinks'
import navPage from './objects/navPage'
import ptBasic from './objects/ptBasic'
import ptBody from './objects/ptBody'
import ptSingle from './objects/ptSingle'
import ptSlim from './objects/ptSlim'
import seo from './objects/seo'
import socialLink from './objects/socialLink'
import pbBlocks from './pbBlocks'
import pbBlockButton from './pbBlocks/pbBlockButton'
import pbBlockDivider from './pbBlocks/pbBlockDivider'
import pbBlockImage from './pbBlocks/pbBlockImage'
import pbBlockMarquee from './pbBlocks/pbBlockMarquee'
import pbBlockPlainText from './pbBlocks/pbBlockPlainText'
import pbBlockText from './pbBlocks/pbBlockText'
import pbBlockVideoEmbed from './pbBlocks/pbBlockVideoEmbed'
import pbSections from './pbSections'
import column from './pbSections/column'
import pbColSettings from './pbSections/pbColSettings'
import pbGridDouble from './pbSections/pbGridDouble'
import pbGridMulti from './pbSections/pbGridMulti'
import pbGridSingle from './pbSections/pbGridSingle'
import pbSectionSettings from './pbSections/pbSectionSettings'
import pbTitleSection from './pbSections/pbTitle'
import blog from './singletons/blog'
import home from './singletons/home'
import settings from './singletons/settings'

export const singletonSchemaTypes = [settings, home, blog]

export const schemaTypes = [
  // Singletons
  settings,
  home,
  blog,
  // Documents
  project,
  article,
  page,
  redirect,
  // Objects
  column,
  navExternal,
  navLinks,
  navPage,
  pbBlockImage,
  pbBlockButton,
  pbBlocks,
  pbBlockDivider,
  pbBlockMarquee,
  pbBlockPlainText,
  pbBlockText,
  pbBlockVideoEmbed,
  pbColSettings,
  pbGridMulti,
  pbGridSingle,
  pbGridDouble,
  pbSections,
  pbSectionSettings,
  pbTitleSection,
  ptBasic,
  ptBody,
  ptSingle,
  ptSlim,
  seo,
  socialLink,
  tag,
]

//export const singletons = []
