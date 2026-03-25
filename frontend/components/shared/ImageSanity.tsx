import {
  SanityImage,
  type SanityImageProps,
  type WrapperProps,
} from 'sanity-image'

import { dataset, projectId } from '@/sanity/lib/api'

/** Helps set reasonable srcset sizes when big images are used. Should go down to 25% of this and up to 200% of this (or original size). */
const MAX_IMAGE_DIMENSION = 1600

function resolveCappedDimensions(
  width: number | undefined,
  height: number | undefined
): [number | undefined, number | undefined] {
  if (width === undefined && height === undefined) {
    return [undefined, undefined]
  }

  const hasW = width !== undefined
  const hasH = height !== undefined

  if (hasW && !hasH) {
    return [
      width! > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION : width,
      undefined,
    ]
  }

  if (!hasW && hasH) {
    return [
      undefined,
      height! > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION : height,
    ]
  }

  const w = width!
  const h = height!
  const longer = Math.max(w, h)
  if (longer <= MAX_IMAGE_DIMENSION) {
    return [w, h]
  }

  const scale = MAX_IMAGE_DIMENSION / longer
  return [Math.round(w * scale), Math.round(h * scale)]
}

const Image = <T extends React.ElementType = 'img'>(props: WrapperProps<T>) => {
  const { width, height, ...rest } = props
  const [w, h] = resolveCappedDimensions(width, height)

  return (
    <SanityImage
      {...({
        projectId,
        dataset,
        ...rest,
        width: w,
        height: h,
      } as SanityImageProps<T>)}
    />
  )
}

export default Image
