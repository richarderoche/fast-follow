'use client'

import type { BlogPageQueryResult } from '@/sanity.types'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import Button from '../shared/Button'
import SiteWidth from '../shared/SiteWidth'
import PostHeader from './PostHeader'
import PostThumbnail from './PostThumbnail'

gsap.registerPlugin(useGSAP)

type BlogFeedProps = Pick<
  NonNullable<BlogPageQueryResult>,
  'allArticles' | 'postsPerLoad'
>

export default function BlogFeed({
  allArticles,
  postsPerLoad = 6,
}: BlogFeedProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [postsToShow, setPostsToShow] = useState<number>(postsPerLoad)
  const [isLoading, setIsLoading] = useState(false)
  const [animateFromIndex, setAnimateFromIndex] = useState<number | null>(null)

  const gridArticles = allArticles.slice(1)
  const postsToRender = gridArticles.slice(0, postsToShow)
  const hasMorePosts = postsToShow < gridArticles.length

  useGSAP(
    () => {
      if (animateFromIndex === null || !gridRef.current) return

      const items = gsap.utils
        .toArray<HTMLElement>(
          gridRef.current.querySelectorAll('[data-blog-feed-item]')
        )
        .filter((el) => Number(el.dataset.index) >= animateFromIndex)

      if (items.length === 0) {
        setIsLoading(false)
        setAnimateFromIndex(null)
        return
      }

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      gsap.set(items, { opacity: 0, scale: prefersReducedMotion ? 1 : 0.85 })
      gsap.to(items, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        onComplete: () => {
          setIsLoading(false)
          setAnimateFromIndex(null)
        },
      })
    },
    { dependencies: [postsToShow, animateFromIndex], scope: gridRef }
  )

  const handleLoadMore = () => {
    if (isLoading || !hasMorePosts) return
    setAnimateFromIndex(postsToShow)
    setIsLoading(true)
    setPostsToShow((n) => n + postsPerLoad)
  }

  return (
    <SiteWidth>
      <PostHeader data={allArticles[0]} showLink={true} />
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gut my-gut-200"
        aria-busy={isLoading}
      >
        {postsToRender.map((post, index) => (
          <div
            key={post.slug}
            data-blog-feed-item
            data-index={index}
            className={cn(
              isLoading &&
                animateFromIndex !== null &&
                index >= animateFromIndex &&
                'opacity-0 corner-container'
            )}
          >
            <PostThumbnail data={post} />
          </div>
        ))}
      </div>
      {hasMorePosts && (
        <div className="flex justify-center">
          <Button
            text="Load More"
            onClick={handleLoadMore}
            disabled={isLoading}
          />
        </div>
      )}
    </SiteWidth>
  )
}
