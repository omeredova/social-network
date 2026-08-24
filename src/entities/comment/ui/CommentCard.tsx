import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { Comment } from '../model/types';

interface CommentCardProps {
  readonly comment: Comment
  readonly actions?: ReactNode
}

export function CommentCard({ comment, actions }: CommentCardProps) {
  return (
    <article className="flex gap-2.5 py-3">
      <Link
        to="/profile/$profileId"
        params={{ profileId: comment.authorId }}
        className="h-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
        aria-label={`Open ${comment.author}'s profile`}
      >
        <Avatar className="size-8 rounded-md">
          {comment.avatarUrl && (
            <AvatarImage
              src={comment.avatarUrl}
              alt={`Portrait of ${comment.author}`}
            />
          )}
          <AvatarFallback
            className="rounded-md text-xs font-semibold text-white"
            style={{ backgroundColor: comment.avatarColor }}
          >
            {comment.author
              .split(' ')
              .map((name) => name[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to="/profile/$profileId"
              params={{ profileId: comment.authorId }}
              className="text-sm font-semibold text-post-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
            >
              {comment.author}
            </Link>
            <div className="flex flex-wrap items-center gap-x-1 text-xs text-post-muted">
              <Link
                to="/profile/$profileId"
                params={{ profileId: comment.authorId }}
                className="hover:text-post-action-link-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
              >
                {comment.handle}
              </Link>
              <span aria-hidden="true">·</span>
              <time>
                {comment.publishedAt}
                {comment.publishedAt === 'just now' ? '' : ' ago'}
              </time>
            </div>
          </div>
          {actions}
        </div>
        <p className="my-1 whitespace-pre-wrap text-sm leading-6 text-post-foreground">
          {comment.text}
        </p>
      </div>
    </article>
  )
}