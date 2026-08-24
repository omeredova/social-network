import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useDeleteComment } from '../model/useDeleteComment'

interface CommentDeleteButtonProps {
  readonly commentId: string
  readonly postId: string
  readonly userId: string
  readonly authorName: string
}

export function CommentDeleteButton({
  commentId,
  postId,
  userId,
  authorName,
}: CommentDeleteButtonProps) {
  const deleteComment = useDeleteComment()

  return (
    <div className="flex shrink-0 flex-col items-end">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-post-muted hover:bg-post-toolbar hover:text-post-foreground focus-visible:ring-post-focus"
        aria-label={`Delete comment by ${authorName}`}
        title="Delete comment"
        disabled={deleteComment.isPending}
        onClick={() => {
          deleteComment.mutate({ commentId, postId, userId })
        }}
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
      {deleteComment.isError && (
        <span
          className="max-w-40 text-right text-xs text-destructive"
          role="alert"
        >
          {deleteComment.error.message}
        </span>
      )}
    </div>
  )
}