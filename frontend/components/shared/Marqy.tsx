'use client'

import { cn } from '@/lib/utils'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'

export declare interface MarqyProps {
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  pauseOnHover?: boolean
  children: React.ReactNode
}

export function Marqy({
  speed = 0.5,
  direction = 'left',
  pauseOnHover,
  children,
  ...rest
}: MarqyProps): React.ReactNode {
  const [reps, setReps] = useState(1)

  const isVertical = direction === 'up' || direction === 'down'
  const [container, containerSize] = useSize()
  const [item, itemSize] = useSize()
  const containerMeasure = isVertical
    ? containerSize.height
    : containerSize.width
  const itemMeasure = isVertical ? itemSize.height : itemSize.width
  const isReady = containerMeasure > 0 && itemMeasure > 0

  const handleSetReps = useEffectEvent(
    (containerMeasure: number, itemMeasure: number) => {
      setReps(Math.ceil(containerMeasure / itemMeasure))
    }
  )

  useEffect(() => {
    if (containerMeasure && itemMeasure) {
      handleSetReps(containerMeasure, itemMeasure)
    }
  }, [containerMeasure, itemMeasure])

  return (
    <div
      ref={container}
      data-marqy
      data-direction={direction}
      data-pause-on-hover={pauseOnHover ? '' : null}
      data-ready={isReady ? '' : null}
      className={cn(isVertical ? 'marqy-vertical' : 'marqy-horizontal')}
      {...rest}
    >
      <div data-marqy-inner>
        {new Array(2).fill(0).map((_, clone) => {
          return (
            <div
              key={clone}
              data-marqy-content
              style={{
                animationDuration: `${
                  ((itemMeasure ?? 0) * reps) / (100 * speed)
                }s`,
              }}
            >
              {new Array(reps).fill(0).map((_, rep) => {
                const isFirstItem = clone === 0 && rep === 0
                return (
                  <div
                    key={rep}
                    ref={isFirstItem ? item : null}
                    data-marqy-item
                  >
                    {children}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function useSize() {
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
