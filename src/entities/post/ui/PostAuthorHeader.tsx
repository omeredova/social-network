import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { CardHeader } from '@/shared/ui/card'
import type { Post } from '../model/types'

interface PostAuthorHeaderProps {
  readonly post: Post
}

export function PostAuthorHeader({ post }: PostAuthorHeaderProps) {
  return (
    <CardHeader className="flex-row items-center gap-3 space-y-0 p-5 pb-3 pr-12">
      <Link
        to="/profile/$profileId"
        params={{ profileId: post.authorId }}
        className="relative z-20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
        aria-label={`Open ${post.author}'s profile`}
      >
        <Avatar className="size-10">
          <AvatarImage src={post.avatarUrl} alt={`Portrait of ${post.author}`} />
          <AvatarFallback
            className="text-xs font-semibold text-white"
            style={{ backgroundColor: post.avatarColor }}
          >
            {post.author.split(' ').map((name) => name[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to="/profile/$profileId"
          params={{ profileId: post.authorId }}
          className="relative z-20 block truncate text-sm font-semibold text-post-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
        >
          {post.author}
        </Link>
        <div className="text-xs text-post-muted">
          <Link
            to="/profile/$profileId"
            params={{ profileId: post.authorId }}
            className="relative z-20 hover:text-post-action-link-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
          >
            {post.handle}
          </Link>
          {' · '}{post.publishedAt} ago
        </div>
      </div>
    </CardHeader>
  )
}
