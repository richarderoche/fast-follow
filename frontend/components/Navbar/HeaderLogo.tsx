import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function HeaderLogo({ sizeClass = 'ts-header-logo' }) {
  return (
    <Link
      id="header-logo"
      className={cn('pointer-events-auto opacity-0', sizeClass)}
      href="/"
    >
      <span className="font-bold">Fast</span>
      <span>Follow</span>
    </Link>
  )
}
