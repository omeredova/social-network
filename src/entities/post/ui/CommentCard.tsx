import { Heart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import type { Comment } from '../model/types';

interface CommentCardProps {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <article className="flex gap-3 border-b border-post-border py-4 last:border-b-0">
      <Avatar className="size-9">
        <AvatarFallback
          className="text-xs font-semibold text-white"
          style={{ backgroundColor: comment.avatarColor }}
        >
          {comment.author.split(' ').map((name) => name[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-sm font-semibold text-post-foreground">{comment.author}</p>
          <p className="text-xs text-post-muted">{comment.handle} · {comment.publishedAt} ago</p>
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