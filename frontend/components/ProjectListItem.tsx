import ImageBasic from '@/components/shared/ImageBasic'
import { getTrueSizes } from '@/lib/utils'
import type { Image } from 'sanity'

interface ProjectProps {
  project: {
    _id: string
    _type: string
    coverImage?: Image
    slug?: string
    title?: string
  }
}

export function ProjectListItem(props: ProjectProps) {
  const { project } = props

  return (
    <div className="corner-container">
      <ImageBasic
        image={project.coverImage as Image}
        alt={`Cover image from ${project.title}`}
        sizes={getTrueSizes({ mobile: 12, tablet: 6, desktop: 4 })}
        className="corner"
        ratio={1}
      />
      <h2 className="ts-p-md mt-gut-50">{project.title}</h2>
    </div>
  )
}
