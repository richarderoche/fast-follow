import Link from 'next/link'

import { cn } from '@/lib/utils'
import { resolveHref } from '@/sanity/lib/utils'
import { NavItem } from '@/types'
import { PiFunnelBold } from 'react-icons/pi'

interface ButtonProps {
  text?: string
  path?: string
  onClick?: () => void
  navItem?: NavItem
  className?: string
  download?: boolean
  icon?: 'filter' | 'none'
  disabled?: boolean
}

export default function Button(props: ButtonProps) {
  const {
    text,
    path,
    navItem,
    onClick,
    className,
    download,
    icon = 'none',
    disabled = false,
  } = props
  let href: string | undefined = ''
  let buttonText: string | undefined = ''

  if (navItem) {
    const { page, title, url } = navItem
    href = page ? resolveHref(page.type, page.slug) : url
    buttonText = title || page?.title || ''
  } else {
    href = path || ''
    buttonText = text || 'Button'
  }

  const isExternal = href?.startsWith('http')
  const buttonClasses = cn(
    'flex w-fit items-center gap-[.2em] py-[.25em] px-[.6em] rounded-full light-theme transition-colors ts-h5',
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  if (href) {
    return (
      <Link
        href={href || ''}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={buttonClasses}
        download={download}
        onClick={onClick}
      >
        <ButtonContent text={buttonText} icon={icon} />
      </Link>
    )
  }

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      <ButtonContent text={buttonText} icon={icon} />
    </button>
  )
}

const ButtonContent = ({
  text,
  icon,
}: {
  text: string
  icon: 'filter' | 'none'
}) => {
  return (
    <>
      <span className="leading-none whitespace-nowrap">{text}</span>
      {icon === 'filter' && (
        <PiFunnelBold className="size-[.8em] relative -top-[.02em]" />
      )}
    </>
  )
}
