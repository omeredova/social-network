import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChevronUp, MessageCircle } from 'lucide-react';
import { CommentCard, usePostComments } from '@/entities/comment';
import { useAuthUser } from '@/features/auth';
import { CommentDeleteButton } from '@/features/delete-comment';
import { CommentLikeButton } from '@/features/like-comment';
import { Button } from '@/shared/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/empty';

interface CommentsListProps {
  readonly postId: string
  readonly query: ReturnType<typeof usePostComments>
  readonly user: ReturnType<typeof useAuthUser>['user']
  readonly scrollToCommentId: string | null
}

export function CommentsList({
  postId,
  query,
  user,
  scrollToCommentId,
}: CommentsListProps) {
  const scrollReference = useRef<HTMLDivElement>(null)
  const loadMoreReference = useRef<HTMLDivElement>(null)
  const comments = useMemo(
    () =>
      (query.data?.pages ?? [])
        .slice()
        .reverse()
        .flatMap((page) => page.comments),
    [query.data?.pages],
  )
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query

  const loadEarlierComments = useCallback(async () => {
    const scrollContainer = scrollReference.current
    if (!scrollContainer || !hasNextPage || isFetchingNextPage) return
    const previousScrollHeight = scrollContainer.scrollHeight
    const previousScrollTop = scrollContainer.scrollTop
    await fetchNextPage()
    requestAnimationFrame(() => {
      const currentContainer = scrollReference.current
      if (!currentContainer) return
      currentContainer.scrollTop =
        previousScrollTop + currentContainer.scrollHeight - previousScrollHeight
    })
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const scrollContainer = scrollReference.current
    if (!scrollContainer || query.data?.pages.length !== 1) return
    scrollContainer.scrollTop = scrollContainer.scrollHeight
  }, [query.data])

  useEffect(() => {
    const scrollContainer = scrollReference.current
    if (
      !scrollContainer ||
      !scrollToCommentId ||
      !comments.some((comment) => comment.id === scrollToCommentId)
    )
      return

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, [comments, scrollToCommentId])

  useEffect(() => {
    const target = loadMoreReference.current
    const scrollContainer = scrollReference.current
    if (!target || !scrollContainer || !hasNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage)
          void loadEarlierComments()
      },
      { root: scrollContainer, rootMargin: '100px 0px' },
    )
    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, loadEarlierComments])

  return (
    <div
      ref={scrollReference}
      className="max-h-96 divide-y divide-post-border overflow-y-auto overscroll-contain"
      aria-label="Post comments"
      tabIndex={0}
    >
      {query.isLoading && (
        <p role="status" className="py-8 text-center text-sm text-post-muted">
          Loading comments…
        </p>
      )}
      {query.isError && (
        <div role="alert" className="py-8 text-center text-sm text-destructive">
          <p>Unable to load comments: {query.error.message}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void query.refetch()}
          >
            Try again
          </Button>
        </div>
      )}
      {query.isSuccess && comments.length === 0 && (
        <Empty className="py-10">
          <EmptyHeader>
            <EmptyMedia>
              <MessageCircle aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No comments yet</EmptyTitle>
            <EmptyDescription>
              Be the first to join the conversation.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      <div ref={loadMoreReference} aria-hidden="true" className="h-px" />
      {query.isFetchingNextPage && (
        <p role="status" className="py-3 text-center text-sm text-post-muted">
          Loading earlier comments…
        </p>
      )}
      {query.hasNextPage && (
        <div className="flex justify-center pb-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-post-muted hover:bg-post-toolbar hover:text-post-foreground"
            aria-label="Load earlier comments"
            disabled={query.isFetchingNextPage}
            onClick={() => void loadEarlierComments()}
          >
            <ChevronUp className="size-5" aria-hidden="true" />
          </Button>
        </div>
      )}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          actions={
            <div className="flex items-center gap-1">
              <CommentLikeButton comment={comment} userId={user?.uid ?? null} />
              {user?.uid === comment.authorId && (
                <CommentDeleteButton
                  commentId={comment.id}
                  postId={postId}
                  userId={user.uid}
                  authorName={comment.author}
                />
              )}
            </div>
          }
        />
      ))}
    </div>
  )
}
