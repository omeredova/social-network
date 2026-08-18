import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import type { Comment } from '../model/types';

interface CommentCardProps {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  const profileId = comment.handle.replace(/^@/, '')

  return (
    <article className="flex gap-3 border-b border-post-border py-4 last:border-b-0">
      <Link
        to="/profile/$profileId"
        params={{ profileId }}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
        aria-label={`Open ${comment.author}'s profile`}
      >
        <Avatar className="size-9">
          <AvatarFallback
            className="text-xs font-semibold text-white"
            style={{ backgroundColor: comment.avatarColor }}
          >
            {comment.author.split(' ').map((name) => name[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Link
            to="/profile/$profileId"
            params={{ profileId }}
            className="text-sm font-semibold text-post-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
          >
            {comment.author}
          </Link>
          <div className="text-xs text-post-muted">
            <Link
              to="/profile/$profileId"
              params={{ profileId }}
              className="hover:text-post-action-link-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
            >
              {comment.handle}
            </Link>
            {' · '}{comment.publishedAt} ago
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-post-foreground">{comment.text}</p>
        <div className="mt-3 flex items-center gap-1 text-xs text-post-muted">
          <Heart className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
          <span>{comment.likes}</span>
        </div>
      </div>
    </article>
  )
}