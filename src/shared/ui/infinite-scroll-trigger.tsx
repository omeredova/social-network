import { useEffect, useRef } from 'react';
import { StatusMessage } from './status-message';

interface InfiniteScrollTriggerProps {
  readonly hasNextPage: boolean
  readonly isLoading: boolean
  readonly loadingMessage: string
  readonly onLoadMore: () => void
}

export function InfiniteScrollTrigger({
  hasNextPage,
  isLoading,
  loadingMessage,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const triggerReference = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = triggerReference.current
    if (!target || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isLoading) onLoadMore()
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isLoading, onLoadMore])

  return (
    <>
      <div ref={triggerReference} aria-hidden="true" className="h-px" />
      {isLoading ? <StatusMessage>{loadingMessage}</StatusMessage> : null}
    </>
  )
}
