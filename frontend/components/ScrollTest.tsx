'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useRef } from 'react'

export default function ScrollTest() {
  const containerRef = useRef<HTMLDivElement>(null)
  const squareRef = useRef<HTMLDivElement>(null)
  gsap.registerPlugin(ScrollTrigger)

  useGSAP(() => {
    gsap.to(squareRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: true,
        pin: true,
      },
      rotation: 360,
    })
  })

  return (
    <div ref={containerRef} className="h-screen relative col-span-12">
      <div
        ref={squareRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-100 bg-black"
      />
    </div>
  )
}
