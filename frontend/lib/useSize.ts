'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [node, setNode] = useState<HTMLElement | null>(null)
  const observer = useRef<ResizeObserver | null>(null)

  const disconnect = useCallback(() => observer.current?.disconnect(), [])

  const observe = useCallback(() => {
    observer.current = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    if (node) observer.current.observe(node)
  }, [node])

  useEffect(() => {
    observe()
    return () => disconnect()
  }, [disconnect, observe])

  return [setNode, size] as const
}
