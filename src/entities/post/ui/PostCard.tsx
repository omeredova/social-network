import { Heart, MessageCircle, Reply } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import type { Post } from '../model/types';

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden rounded-post-card border-post-border bg-post-surface shadow-post-card">
      <CardHeader className="flex-row items-center gap-3 space-y-0 p-5 pb-3">
        <div
          className={`grid size-10 shrink-0 place-items-center text-xs font-semibold text-white ${post.avatarShape === 'circle' ? 'rounded-full' : 'rounded-post-control'}`}
          style={{ backgroundColor: post.avatarColor }}
          aria-label={`${post.author} avatar`}
        >
          {post.author
            .split(' ')
            .map((name) => name[0])
            .join('')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-post-foreground">
            {post.author}
          </p>
          <p className="text-xs text-post-muted">
            {post.handle} · {post.publishedAt} ago
          </p>
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

      <CardFooter className="gap-1 border-t border-post-border px-4 py-2">
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