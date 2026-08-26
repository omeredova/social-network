import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Comment } from '@/entities/comment';
import { Button } from '@/shared/ui/button';
import { useToggleCommentLike } from '../model/useToggleCommentLike';

interface CommentLikeButtonProps {
  readonly comment: Comment
  readonly userId: string | null
}

export function CommentLikeButton({ comment, userId }: CommentLikeButtonProps) {
  const toggleLike = useToggleCommentLike()
  const [liked, setLiked] = useState(
    userId !== null && comment.likeAuthor.includes(userId),
  )
  const [likesDelta, setLikesDelta] = useState(0)
  const likesCount = Math.max(0, comment.likesCount + likesDelta)

  const handleLike = () => {
    if (!userId) return
    const operation = liked ? 'decrement' : 'increment'
    const amount = operation === 'increment' ? 1 : -1

    setLiked((current) => !current)
    setLikesDelta((current) => current + amount)
    toggleLike.mutate(
      { commentId: comment.id, operation, userId },
      {
        onSuccess: () => {
          setLikesDelta((current) => current - amount)
        },
        onError: () => {
          setLikesDelta((current) => current - amount)
          setLiked((current) => !current)
        },
      },
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 rounded-post-control px-2 text-post-action-link hover:bg-post-toolbar hover:text-post-action-link-hover focus-visible:ring-post-focus"
      aria-label={`${liked ? 'Unlike' : 'Like'} comment, ${likesCount.toString()} likes`}
      aria-pressed={liked}
      disabled={!userId || toggleLike.isPending}
      title={userId ? undefined : 'Log in to like comments'}
      onClick={handleLike}
    >
      <Heart
        className={liked ? 'size-4 fill-current text-destructive' : 'size-4'}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <span className="text-xs tabular-nums">{likesCount}</span>
    </Button>
  )
}
