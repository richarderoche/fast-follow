import { cn } from '@/lib/utils'
import IconSquare from '../icons/IconSquare'

export default function Tag({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('flex gap-[.5em] w-fit items-center ts-p-sm', className)}
    >
      <IconSquare className="size-[.5em]" />
      {children}
    </div>
  )
}
