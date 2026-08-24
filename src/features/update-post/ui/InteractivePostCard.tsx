import { useState } from 'react';
import { PostCard, type Post, type PostCounterField } from '@/entities/post';
import { useUpdatePost } from '../model/useUpdatePost';
import { useAuthUser } from '@/features/auth';
import { useDeletePost } from '@/features/delete-post';
import { useRepostPost } from '@/features/repost-post';
import { PostComments } from '@/features/create-comment';

interface InteractivePostCardProps {
  readonly post: Post
  readonly linked?: boolean
  readonly onComment?: (() => void) | undefined
}

interface OptimisticDeltas {
  readonly likes: number
  readonly comments: number
  readonly reposts: number
}

const INITIAL_DELTAS: OptimisticDeltas = { likes: 0, comments: 0, reposts: 0 }

export function InteractivePostCard({
  post,
  linked = false,
  onComment,
}: InteractivePostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const { user } = useAuthUser()
  const repostPost = useRepostPost()
  const deletePost = useDeletePost()
  const { optimisticPost, liked, updateCounter, isUpdating } =
    useOptimisticUpdate(post)
  const canRepost =
    user !== null &&
    user.uid !== post.authorId &&
    user.uid !== post.originalAuthorId
  const canDelete = user !== null && user.uid === post.authorId
  const handleComment = () => {
    if (onComment) {
      onComment()
      return
    }
    setCommentsOpen((current) => !current)
  }

  return (
    <div>
      <PostCard
        post={optimisticPost}
        linked={linked}
        liked={liked}
        isUpdating={isUpdating || repostPost.isPending || deletePost.isPending}
        canRepost={canRepost}
        canDelete={canDelete}
        deleteError={deletePost.isError ? deletePost.error.message : undefined}
        onLike={() => {
          updateCounter('likesCount', liked ? 'decrement' : 'increment')
        }}
        onRepost={() => {
          if (user && canRepost) {
            repostPost.mutate({ postId: post.id, userId: user.uid })
          }
        }}
        onComment={handleComment}
        onDelete={() => {
          if (user && canDelete) {
            deletePost.mutate({ postId: post.id, userId: user.uid })
          }
        }}
      />
      {commentsOpen && (
        <PostComments
          postId={post.id}
          commentsCount={optimisticPost.comments}
          focusRequest={1}
        />
      )}
    </div>
  )
}

function useOptimisticUpdate(post: Post) {
  const updatePost = useUpdatePost()
  const [deltas, setDeltas] = useState(INITIAL_DELTAS)
  const [liked, setLiked] = useState(false)

  const updateCounter = (
    field: PostCounterField,
    operation: 'increment' | 'decrement',
  ) => {
    const amount = operation === 'increment' ? 1 : -1

    setDeltas((current) => changeDelta(current, field, amount))
    if (field === 'likesCount') setLiked((current) => !current)

    updatePost.mutate(
      { postId: post.id, field, operation },
      {
        onSuccess: () => {
          setDeltas((current) => changeDelta(current, field, -amount))
        },
        onError: () => {
          setDeltas((current) => changeDelta(current, field, -amount))
          if (field === 'likesCount') setLiked((current) => !current)
        },
      },
    )
  }

  return {
    optimisticPost: {
      ...post,
      likes: Math.max(0, post.likes + deltas.likes),
      comments: Math.max(0, post.comments + deltas.comments),
      replies: Math.max(0, post.replies + deltas.reposts),
    },
    liked,
    updateCounter,
    isUpdating: updatePost.isPending,
  }
}

function changeDelta(
  deltas: OptimisticDeltas,
  field: PostCounterField,
  amount: number,
): OptimisticDeltas {
  switch (field) {
    case 'likesCount':
      return { ...deltas, likes: deltas.likes + amount }
    case 'commentsCount':
      return { ...deltas, comments: deltas.comments + amount }
    case 'repostsCount':
      return { ...deltas, reposts: deltas.reposts + amount }
  }
}