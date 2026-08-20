import { Heart, MessageCircle, Reply } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card'
import type { Post } from '../model/types'

interface PostCardProps {
  post: Post
  linked?: boolean
}

export function PostCard({ post, linked = false }: PostCardProps) {
  const profileId = post.authorId

  return (
    <Card className="relative overflow-hidden rounded-post-card border-post-border bg-post-surface shadow-post-card">
      {linked && (
        <Link
          to="/posts/$postId"
          params={{ postId: post.id }}
          className="absolute inset-0 z-10 rounded-post-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-post-focus"
          aria-label={`Open post by ${post.author}`}
        />
      )}
      <CardHeader className="flex-row items-center gap-3 space-y-0 p-5 pb-3">
        <Link
          to="/profile/$profileId"
          params={{ profileId }}
          className="relative z-20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
          aria-label={`Open ${post.author}'s profile`}
        >
          <Avatar className="size-10">
            <AvatarImage
              src={post.avatarUrl}
              alt={`Portrait of ${post.author}`}
            />
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
            params={{ profileId }}
            className="relative z-20 block truncate text-sm font-semibold text-post-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
          >
            {post.author}
          </Link>
          <div className="text-xs text-post-muted">
            <Link
              to="/profile/$profileId"
              params={{ profileId }}
              className="relative z-20 hover:text-post-action-link-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
            >
              {post.handle}
            </Link>
            {' · '}{post.publishedAt} ago
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <p className="text-sm leading-6 text-post-foreground">{post.text}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            className="mt-4 aspect-[16/10] w-full rounded-post-control object-cover"
          />
        )}
      </CardContent>

      <CardFooter className="relative z-20 gap-1 border-t border-post-border px-4 py-2">
        <ActionButton label="Reply" count={post.replies} icon={Reply} />
        <ActionButton label="Like" count={post.likes} icon={Heart} />
        <ActionButton
          label="Comment"
          count={post.comments}
          icon={MessageCircle}
        />
      </CardFooter>
    </Card>
  )
}

interface ActionButtonProps {
  label: string
  count: number
  icon: typeof Heart
}

function ActionButton({ label, count, icon: Icon }: ActionButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 rounded-post-control px-2 text-post-action-link hover:bg-post-toolbar hover:text-post-action-link-hover focus-visible:ring-post-focus"
      aria-label={`${label}, ${count.toString()}`}
    >
      <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
      <span className="text-xs tabular-nums">{count}</span>
    </Button>
  )
}