'use client'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { useIntersectionObserver } from 'hamo'
import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

export default function Video({
  playbackId,
  className = '',
  style = {},
  useManualIsInView = false,
  manualIsInView,
  disablePoster = false,
  controls = true,
  ...props
}: {
  playbackId?: string
  title?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
  playsInline?: boolean
  controls?: boolean
  style?: React.CSSProperties
  useManualIsInView?: boolean
  manualIsInView?: boolean
  disablePoster?: boolean
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void
}) {
  const src = `https://stream.mux.com/${playbackId}.m3u8`
  const poster = disablePoster
    ? undefined
    : `https://image.mux.com/${playbackId}/thumbnail.webp?time=0&width=1000`
  const [setRef, intersection] = useIntersectionObserver()
  const isInViewR = useManualIsInView
    ? manualIsInView
    : intersection.isIntersecting
  const isInViewM = useManualIsInView ? manualIsInView : false
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasAnimatedInRef = useRef(false)
  const disableVideo =
    process.env.NEXT_PUBLIC_DISABLE_VIDEO === 'true' ? true : false

  useEffect(() => {
    let hls

    if (videoRef.current) {
      const video = videoRef.current
      hasAnimatedInRef.current = false
      gsap.set(video, { autoAlpha: 0 })

      const fadeInVideo = () => {
        if (hasAnimatedInRef.current) {
          return
        }
        hasAnimatedInRef.current = true
        gsap.to(video, {
          autoAlpha: 1,
          duration: 0.35,
          ease: 'power1.out',
          overwrite: true,
        })
      }

      video.addEventListener('loadeddata', fadeInVideo)
      video.addEventListener('canplay', fadeInVideo)

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
      } else if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
      }

      if (video.readyState >= 2) {
        fadeInVideo()
      }

      return () => {
        video.removeEventListener('loadeddata', fadeInVideo)
        video.removeEventListener('canplay', fadeInVideo)
        gsap.killTweensOf(video)
        if (hls) {
          hls.destroy()
        }
      }
    }
  }, [videoRef, src])

  useEffect(() => {
    const isInView = useManualIsInView ? isInViewM : isInViewR
    if (videoRef.current) {
      if (isInView && !disableVideo) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [useManualIsInView, isInViewR, isInViewM, disableVideo])

  return (
    <video
      ref={(node) => {
        setRef(node)
        videoRef.current = node
      }}
      controls={controls}
      className={cn(
        className,
        (useManualIsInView && isInViewM) || (!useManualIsInView && isInViewR)
          ? 'in-view'
          : 'not-in-view',
        !controls && 'pointer-events-none'
      )}
      style={style}
      poster={poster}
      {...props}
    />
  )
}
