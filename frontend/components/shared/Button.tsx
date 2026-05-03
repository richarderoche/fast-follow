import Link from 'next/link'

import { cn } from '@/lib/utils'
import { resolveHref } from '@/sanity/lib/utils'
import { NavItem } from '@/types'
import { PiFunnelBold } from 'react-icons/pi'
import IconCloseSmall from '../icons/IconCloseSmall'

type ButtonOwnProps = {
  text?: string
  path?: string
  navItem?: NavItem
  download?: boolean
  icon?: 'filter' | 'close' | 'close-spacer' | 'none'
  outline?: boolean
}

/**
 * Handlers and globals typed for `HTMLElement` so they apply to both `<button>` and `<a>`
 */
type InteractivePassthroughProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof ButtonOwnProps | 'children'
>

type ButtonOnlyProps = Pick<
  React.ComponentPropsWithoutRef<'button'>,
  'disabled' | 'type'
>

export type ButtonProps = ButtonOwnProps &
  InteractivePassthroughProps &
  ButtonOnlyProps

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
    outline = false,
    ...rest
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
    'flex w-fit items-center py-[.25em] px-[.6em] rounded-full  transition-colors ts-h5',
    outline ? 'border' : 'light-theme',
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
        {...rest}
      >
        <ButtonContent text={buttonText} icon={icon} />
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <ButtonContent text={buttonText} icon={icon} />
    </button>
  )
}

const ButtonContent = ({
  text,
  icon,
}: {
  text: string
  icon: 'filter' | 'close' | 'close-spacer' | 'none'
}) => {
  return (
    <>
      <span
        className={cn(
          'leading-none whitespace-nowrap',
          icon === 'close-spacer' && 'px-[.35em]'
        )}
      >
        {text}
      </span>
      {icon === 'filter' && (
        <PiFunnelBold className="size-[.8em] relative -top-[.02em] ml-[.2em]" />
      )}
      {(icon === 'close' || icon === 'close-spacer') && (
        <IconCloseSmall
          className={cn(
            icon === 'close' && 'size-[.5em] ml-[.2em]',
            icon === 'close-spacer' && 'size-0 ml-0'
          )}
        />
      )}
    </>
  )
}
