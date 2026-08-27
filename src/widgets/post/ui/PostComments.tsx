import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { usePostComments } from '@/entities/comment';
import { useAuthUser } from '@/features/auth';
import { CommentComposer } from '@/features/create-comment';
import { Card, CardHeader } from '@/shared/ui/card';
import { CommentsList } from './CommentsList';

interface PostCommentsProps {
  readonly postId: string
  readonly commentsCount: number
  readonly focusRequest?: number
}

export const PostComments = observer(function PostComments({
  postId,
  commentsCount,
  focusRequest = 0,
}: PostCommentsProps) {
  const commentsQuery = usePostComments(postId)
  const { user } = useAuthUser()
  const [createdCommentId, setCreatedCommentId] = useState<string | null>(null)

  return (
    <Card
      role="region"
      className="rounded-none border-post-border bg-post-surface px-4 shadow-none sm:px-5"
      aria-labelledby={`comments-heading-${postId}`}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-post-border p-0 py-3">
        <h2
          id={`comments-heading-${postId}`}
          className="text-sm font-semibold text-post-foreground"
        >
          Comments
        </h2>
        <span className="text-xs text-post-muted">{commentsCount}</span>
      </CardHeader>
      <CommentsList
        postId={postId}
        query={commentsQuery}
        user={user}
        scrollToCommentId={createdCommentId}
      />
      <CommentComposer
        postId={postId}
        focusRequest={focusRequest}
        user={user}
        onCommentCreated={setCreatedCommentId}
      />
    </Card>
  )
})