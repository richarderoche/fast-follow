'use client'

import { cn } from '@/lib/utils'
import { createPlayer } from '@videojs/react'
import { HlsVideo } from '@videojs/react/media/hls-video'
import { VideoSkin, videoFeatures } from '@videojs/react/video'
import '@videojs/react/video/skin.css'
import gsap from 'gsap'
import { useIntersectionObserver } from 'hamo'
import { useCallback, useEffect, useRef } from 'react'

const Player = createPlayer({ features: videoFeatures })

type VideoJSProps = {
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
}

function PlaybackSync({
  shouldPlay,
  disableVideo,
  onLoadedMetadata,
  onReady,
  onVideoElement,
}: {
  shouldPlay: boolean
  disableVideo: boolean
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void
  onReady: () => void
  onVideoElement: (video: HTMLVideoElement | null) => void
}) {
  const media = Player.useMedia()
  const video = (media?.target ?? null) as HTMLVideoElement | null

  useEffect(() => {
    onVideoElement(video)
    return () => onVideoElement(null)
  }, [video, onVideoElement])

  useEffect(() => {
    if (!video) return

    const handleReady = () => onReady()
    const handleMetadata = () => {
      onLoadedMetadata?.({
        currentTarget: video,
      } as React.SyntheticEvent<HTMLVideoElement>)
    }

    video.addEventListener('loadeddata', handleReady)
    video.addEventListener('canplay', handleReady)
    video.addEventListener('loadedmetadata', handleMetadata)

    if (video.readyState >= 2) handleReady()
    if (video.readyState >= 1) handleMetadata()

    return () => {
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('canplay', handleReady)
      video.removeEventListener('loadedmetadata', handleMetadata)
    }
  }, [video, onReady, onLoadedMetadata])

  useEffect(() => {
    if (!video) return

    if (shouldPlay && !disableVideo) {
      void video.play()
    } else {
      video.pause()
    }
  }, [video, shouldPlay, disableVideo])

  return null
}

export default function VideoJS({
  playbackId,
  className = '',
  style = {},
  useManualIsInView = false,
  manualIsInView,
  disablePoster = false,
  controls = true,
  loop,
  muted,
  playsInline = true,
  onLoadedMetadata,
  ...props
}: VideoJSProps) {
  const src = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : ''
  const poster = disablePoster
    ? undefined
    : playbackId
      ? `https://image.mux.com/${playbackId}/thumbnail.webp?time=0&width=1000`
      : undefined

  const [setRef, intersection] = useIntersectionObserver()
  const isInViewR = useManualIsInView
    ? manualIsInView
    : intersection.isIntersecting
  const isInViewM = useManualIsInView ? manualIsInView : false
  const shouldPlay = useManualIsInView ? !!isInViewM : !!isInViewR
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const hasAnimatedInRef = useRef(false)
  const disableVideo =
    process.env.NEXT_PUBLIC_DISABLE_VIDEO === 'true' ? true : false

  const handleVideoElement = useCallback((video: HTMLVideoElement | null) => {
    videoElRef.current = video
    if (video) {
      hasAnimatedInRef.current = false
      gsap.set(video, { autoAlpha: 0 })
    }
  }, [])

  const fadeInVideo = useCallback(() => {
    const video = videoElRef.current
    if (!video || hasAnimatedInRef.current) return
    hasAnimatedInRef.current = true
    gsap.to(video, {
      autoAlpha: 1,
      duration: 0.35,
      ease: 'power1.out',
      overwrite: true,
    })
  }, [])

  if (!src) return null

  const skinStyle = {
    ...style,
    '--media-border-color': 'transparent',
    '--media-border-radius': '0',
    '--media-video-border-radius': '0',
    '--media-object-fit': 'contain',
    '--media-object-position': 'center',
  } as React.CSSProperties

  const media = (
    <HlsVideo
      src={src}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload="auto"
      {...props}
    />
  )

  return (
    <div
      ref={setRef}
      className={cn(
        'absolute inset-0 min-h-0 min-w-0 overflow-hidden',
        (useManualIsInView && isInViewM) || (!useManualIsInView && isInViewR)
          ? 'in-view'
          : 'not-in-view',
        className
      )}
      style={style}
    >
      <Player.Provider key={src}>
        {controls ? (
          <VideoSkin
            className="videojs-overlay-player h-full w-full"
            style={skinStyle}
            poster={poster}
          >
            {media}
          </VideoSkin>
        ) : (
          <Player.Container
            className="videojs-overlay-player h-full w-full"
            style={skinStyle}
          >
            {media}
          </Player.Container>
        )}
        <PlaybackSync
          shouldPlay={shouldPlay}
          disableVideo={disableVideo}
          onLoadedMetadata={onLoadedMetadata}
          onReady={fadeInVideo}
          onVideoElement={handleVideoElement}
        />
      </Player.Provider>
    </div>
  )
}
