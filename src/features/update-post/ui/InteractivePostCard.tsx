import { useState } from 'react';
import { PostCard, type Post, type PostCounterField } from '@/entities/post';
import { useUpdatePost } from '../model/useUpdatePost';

interface InteractivePostCardProps {
  readonly post: Post
  readonly linked?: boolean
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
}: InteractivePostCardProps) {
  const { optimisticPost, liked, reposted, updateCounter, isUpdating } =
    useOptimisticUpdate(post)

  return (
    <PostCard
      post={optimisticPost}
      linked={linked}
      liked={liked}
      reposted={reposted}
      isUpdating={isUpdating}
      onLike={() => {
        updateCounter('likesCount', liked ? 'decrement' : 'increment')
      }}
      onRepost={() => {
        updateCounter('repostsCount', reposted ? 'decrement' : 'increment')
      }}
      onComment={() => {
        updateCounter('commentsCount', 'increment')
      }}
    />
  )
}

function useOptimisticUpdate(post: Post) {
  const updatePost = useUpdatePost()
  const [deltas, setDeltas] = useState(INITIAL_DELTAS)
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)

  const updateCounter = (
    field: PostCounterField,
    operation: 'increment' | 'decrement',
  ) => {
    const amount = operation === 'increment' ? 1 : -1

    setDeltas((current) => changeDelta(current, field, amount))
    if (field === 'likesCount') setLiked((current) => !current)
    if (field === 'repostsCount') setReposted((current) => !current)

    updatePost.mutate(
      { postId: post.id, field, operation },
      {
        onSuccess: () => {
          setDeltas((current) => changeDelta(current, field, -amount))
        },
        onError: () => {
          setDeltas((current) => changeDelta(current, field, -amount))
          if (field === 'likesCount') setLiked((current) => !current)
          if (field === 'repostsCount') setReposted((current) => !current)
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
    reposted,
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