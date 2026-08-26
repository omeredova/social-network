import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useCreateComment } from '../model/useCreateComment';

interface CommentComposerProps {
  readonly postId: string
  readonly focusRequest: number
  readonly user: CommentComposerUser | null
  readonly onCommentCreated: (commentId: string) => void
}

interface CommentComposerUser {
  readonly uid: string
  readonly displayName: string
  readonly photoURL: string
}

export function CommentComposer({
  postId,
  focusRequest,
  user,
  onCommentCreated,
}: CommentComposerProps) {
  const createComment = useCreateComment()
  const [comment, setComment] = useState('')
  const inputReference = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusRequest > 0) inputReference.current?.focus()
  }, [focusRequest])

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !comment.trim()) return
    createComment.mutate(
      { authorId: user.uid, postId, content: comment },
      {
        onSuccess: (commentId) => {
          setComment('')
          onCommentCreated(commentId)
        },
      },
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-post-border py-3"
      >
        <Avatar className="size-8 rounded-md">
          {user?.photoURL && (
            <AvatarImage src={user.photoURL} alt="Your profile portrait" />
          )}
          <AvatarFallback className="rounded-md bg-post-foreground text-[10px] font-semibold text-white">
            {user?.displayName.slice(0, 2).toUpperCase() ?? 'YO'}
          </AvatarFallback>
        </Avatar>
        <Input
          ref={inputReference}
          value={comment}
          onChange={(event) => {
            setComment(event.target.value)
          }}
          placeholder="Add comment"
          aria-label="Add comment"
          disabled={!user || createComment.isPending}
          className="h-8 flex-1 border-0 bg-post-toolbar px-3 text-sm shadow-none focus-visible:ring-post-focus"
        />
        <Button
          type="submit"
          size="sm"
          className="h-8 px-3"
          disabled={!user || !comment.trim() || createComment.isPending}
        >
          {createComment.isPending ? 'Posting…' : 'Post'}
        </Button>
      </form>
      {!user && (
        <p className="border-t border-post-border py-3 text-xs text-post-muted">
          <Link to="/account/login" className="underline">
            Sign in
          </Link>{' '}
          to join the conversation.
        </p>
      )}
      {createComment.isError && (
        <p role="alert" className="pb-3 text-sm text-destructive">
          {createComment.error.message}
        </p>
      )}
    </>
  )
}
