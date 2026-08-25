import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import type { Post } from '../model/types'
import { PostActionBar } from './PostActionBar'
import { PostAuthorHeader } from './PostAuthorHeader'
import { PostDeleteButton } from './PostDeleteButton'
import { PostRepostAttribution } from './PostRepostAttribution'
import { RepostedProfilePreview } from './RepostedProfilePreview'
import { MentionText } from '@/entities/user/ui/MentionText'

interface PostCardProps {
  post: Post
  linked?: boolean
  isUpdating?: boolean
  liked?: boolean
  reposted?: boolean
  canRepost?: boolean
  canDelete?: boolean
  deleteError?: string | undefined
  onLike?: () => void
  onRepost?: () => void
  onComment?: () => void
  onDelete?: () => void
}

export function PostCard({
  post,
  linked = false,
  isUpdating = false,
  liked = false,
  reposted = false,
  canRepost = true,
  canDelete = false,
  deleteError,
  onLike,
  onRepost,
  onComment,
  onDelete,
}: PostCardProps) {
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
      {canDelete && (
        <PostDeleteButton disabled={isUpdating} onDelete={onDelete} />
      )}
      {post.originalAuthorId && post.originalAuthor && (
        <PostRepostAttribution
          authorId={post.originalAuthorId}
          author={post.originalAuthor}
        />
      )}

      <PostAuthorHeader post={post} />
      <CardContent className="p-5 pt-0">
        {post.text && (
          <p className="whitespace-pre-wrap text-sm leading-6 text-post-foreground">
            <MentionText text={post.text} />
          </p>
        )}
        {post.location && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-post-muted">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span>{post.location}</span>
          </p>
        )}
        {post.repostedProfile && (
          <RepostedProfilePreview profile={post.repostedProfile} />
        )}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            className="mt-4 aspect-[16/10] w-full rounded-post-control object-cover"
          />
        )}
      </CardContent>

      <PostActionBar
        post={post}
        isUpdating={isUpdating}
        liked={liked}
        reposted={reposted}
        canRepost={canRepost}
        onLike={onLike}
        onRepost={onRepost}
        onComment={onComment}
      />
      {deleteError && (
        <p
          role="alert"
          className="relative z-20 px-5 pb-3 text-sm text-destructive"
        >
          {deleteError}
        </p>
      )}
    </Card>
  )
}
