'use client'
import { useProjectsStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Button from '../shared/Button'

export default function FeedControls({
  onToggleFilters,
}: {
  onToggleFilters: () => void
}) {
  const { thumbnailsPerRow, setThumbnailsPerRow } = useProjectsStore()

  return (
    <div className="flex justify-between items-center pt-header pb-gut-50">
      <Button text="Filter" icon="filter" onClick={onToggleFilters} />
      <div className="flex gap-gut-50 max-md:hidden">
        <Button
          className={cn(thumbnailsPerRow !== 1 && 'opacity-50')}
          text="1"
          onClick={() => setThumbnailsPerRow(1)}
        />
        <Button
          className={cn(thumbnailsPerRow !== 2 && 'opacity-50')}
          text="2"
          onClick={() => setThumbnailsPerRow(2)}
        />
        <Button
          className={cn(thumbnailsPerRow !== 3 && 'opacity-50 max-lg:hidden')}
          text="3"
          onClick={() => setThumbnailsPerRow(3)}
        />
      </div>
    </div>
  )
}
