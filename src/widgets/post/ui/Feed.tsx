import { observer } from 'mobx-react-lite';
import type { Post } from '@/entities/post';
import { useAuthUser } from '@/features/auth';
import { CreatePost } from '@/features/create-post';
import { InfiniteScrollTrigger } from '@/shared/ui/infinite-scroll-trigger';
import { StatusMessage } from '@/shared/ui/status-message';
import { InteractivePostCard } from './InteractivePostCard';

interface FeedProps {
  posts: readonly Post[]
  isLoading?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export const Feed = observer(function Feed({
  posts,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: FeedProps) {
  const { user, isLoading: isAuthLoading } = useAuthUser()

  if (isLoading) {
    return <StatusMessage>Loading posts…</StatusMessage>
  }

  return (
    <>
      <CreatePost authorId={user?.uid ?? null} isAuthLoading={isAuthLoading} />
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
})