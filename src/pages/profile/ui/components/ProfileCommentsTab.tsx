import { MessagesSquare } from 'lucide-react';
import {
  CommentCard,
  type Comment,
  useCommentsByAuthor,
} from '@/entities/comment';
import { usePost } from '@/entities/post';
import { InteractivePostCard } from '@/features/update-post';
import { Card } from '@/shared/ui/card';
import { InfiniteScrollTrigger } from '@/shared/ui/infinite-scroll-trigger';
import { StatusMessage } from '@/shared/ui/status-message';

interface ProfileCommentsTabProps {
  readonly profileId: string
}

export function ProfileCommentsTab({ profileId }: ProfileCommentsTabProps) {
  const query = useCommentsByAuthor(profileId, true)
  const comments = query.data?.pages.flatMap((page) => page.comments) ?? []

  if (query.isLoading) {
    return (
      <StatusMessage className="py-10 text-center">
        Loading comments…
      </StatusMessage>
    )
  }

  if (query.isError) {
    return (
      <StatusMessage tone="destructive" className="py-10 text-center">
        Unable to load comments.
      </StatusMessage>
    )
  }

  if (comments.length === 0) return <EmptyComments />

  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <CommentedPost key={comment.id} comment={comment} />
      ))}
      <InfiniteScrollTrigger
        hasNextPage={query.hasNextPage}
        isLoading={query.isFetchingNextPage}
        loadingMessage="Loading more comments…"
        onLoadMore={() => void query.fetchNextPage()}
      />
    </div>
  )
}

function EmptyComments() {
  return (
    <div className="grid place-items-center gap-2 py-10 text-center text-post-muted">
      <MessagesSquare className="size-6" aria-hidden="true" />
      <p className="text-sm">No comments yet</p>
    </div>
  )
}

interface CommentedPostProps {
  readonly comment: Comment
}

function CommentedPost({ comment }: CommentedPostProps) {
  const postQuery = usePost(comment.postId)

  return (
    <article
      className="[&>div:first-child>div]:rounded-b-none"
      aria-label="Original post with selected user comment"
    >
      {postQuery.isLoading ? (
        <CommentedPostStatus>Loading commented post…</CommentedPostStatus>
      ) : postQuery.isError ? (
        <CommentedPostStatus tone="destructive">
          Unable to load the commented post.
        </CommentedPostStatus>
      ) : postQuery.data ? (
        <InteractivePostCard
          post={postQuery.data}
          linked
          onComment={() => undefined}
        />
      ) : (
        <CommentedPostStatus>
          This post is no longer available.
        </CommentedPostStatus>
      )}

      <Card className="rounded-t-none rounded-b-post-card border-post-border border-t-0 bg-post-surface px-5 shadow-post-card">
        <p className="pt-3 text-xs font-medium uppercase tracking-wide text-post-muted">
          Selected comment
        </p>
        <CommentCard comment={comment} />
      </Card>
    </article>
  )
}

interface CommentedPostStatusProps {
  readonly children: string
  readonly tone?: 'muted' | 'destructive'
}

function CommentedPostStatus({
  children,
  tone = 'muted',
}: CommentedPostStatusProps) {
  return (
    <Card className="rounded-profile-card border-post-border bg-post-surface p-5 shadow-post-card">
      <StatusMessage tone={tone}>{children}</StatusMessage>
    </Card>
  )
}
