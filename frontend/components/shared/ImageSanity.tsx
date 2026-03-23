import { SanityImage, type WrapperProps } from 'sanity-image'

import { dataset, projectId } from '@/sanity/lib/api'

const Image = <T extends React.ElementType = 'img'>(props: WrapperProps<T>) => (
  <SanityImage projectId={projectId} dataset={dataset} {...props} />
)

export default Image
