import { type RefObject, useEffect, useRef } from 'react'

type OutsideClickEvent = MouseEvent | TouchEvent
type OutsideClickHandler = (event: OutsideClickEvent) => void

export default function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: OutsideClickHandler = () => {}
): readonly [RefObject<T | null>] {
  const ref = useRef<T>(null)

  useEffect(() => {
    const listener = (event: OutsideClickEvent) => {
      const target = event.target as Node | null

      // Do nothing if clicking ref's element or descendant elements.
      if (!ref.current || (target && ref.current.contains(target))) {
        return
      }

      handler(event)
    }

    document.addEventListener('click', listener)
    document.addEventListener('touchend', listener)

    return () => {
      document.removeEventListener('click', listener)
      document.removeEventListener('touchend', listener)
    }
  }, [handler])

  return [ref] as const
}
