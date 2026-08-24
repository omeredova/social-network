import type { Post } from '@/entities/post';
import { CreatePost } from '@/features/create-post';
import { InteractivePostCard } from '@/features/update-post';
import { InfiniteScrollTrigger } from '@/shared/ui/infinite-scroll-trigger';
import { StatusMessage } from '@/shared/ui/status-message';

interface FeedProps {
  posts: readonly Post[]
  isLoading?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export function Feed({
  posts,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: FeedProps) {
  if (isLoading) {
    return <StatusMessage>Loading posts…</StatusMessage>
  }

  return (
    <>
      <CreatePost />
      {posts.length > 0 ? (
        <div className="space-y-5">
          {posts.map((post) => (
            <InteractivePostCard key={post.id} post={post} linked />
          ))}
          {onLoadMore ? (
            <InfiniteScrollTrigger
              hasNextPage={hasNextPage}
              isLoading={isFetchingNextPage}
              loadingMessage="Loading more posts…"
              onLoadMore={onLoadMore}
            />
          ) : null}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-post-muted">
          No posts yet. Create the first one.
        </p>
      )}
    </>
  )
}