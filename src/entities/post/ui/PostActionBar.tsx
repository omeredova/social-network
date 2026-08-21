import { Heart, MessageCircle, Repeat2, type LucideIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { CardFooter } from '@/shared/ui/card'
import type { Post } from '../model/types'

interface PostActionBarProps {
  readonly post: Post
  readonly isUpdating: boolean
  readonly liked: boolean
  readonly reposted: boolean
  readonly canRepost: boolean
  readonly onLike?: (() => void) | undefined
  readonly onRepost?: (() => void) | undefined
  readonly onComment?: (() => void) | undefined
}

export function PostActionBar({
  post,
  isUpdating,
  liked,
  reposted,
  canRepost,
  onLike,
  onRepost,
  onComment,
}: PostActionBarProps) {
  return (
    <CardFooter className="relative z-20 gap-1 border-t border-post-border px-4 py-2">
      <ActionButton label="Repost" count={post.replies} icon={Repeat2} active={reposted} disabled={isUpdating || !canRepost} onClick={onRepost} />
      <ActionButton label="Like" count={post.likes} icon={Heart} active={liked} disabled={isUpdating} onClick={onLike} />
      <ActionButton label="Comment" count={post.comments} icon={MessageCircle} disabled={isUpdating} onClick={onComment} />
    </CardFooter>
  )
}

interface ActionButtonProps {
  readonly label: string
  readonly count: number
  readonly icon: LucideIcon
  readonly active?: boolean
  readonly disabled?: boolean
  readonly onClick?: (() => void) | undefined
}

function ActionButton({ label, count, icon: Icon, active = false, disabled = false, onClick }: ActionButtonProps) {
  return (
    <Button type="button" variant="ghost" size="sm" className="h-8 rounded-post-control px-2 text-post-action-link hover:bg-post-toolbar hover:text-post-action-link-hover focus-visible:ring-post-focus" aria-label={`${label}, ${count.toString()}`} aria-pressed={label === 'Comment' ? undefined : active} disabled={disabled} onClick={onClick}>
      <Icon className={active ? 'size-4 fill-current' : 'size-4'} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
      <span className="text-xs tabular-nums">{count}</span>
    </Button>
  )
}