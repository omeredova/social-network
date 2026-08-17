import { PostCard, type Post } from '@/entities/post';
import { CreatePost } from '@/features/create-post';

interface FeedProps {
  posts: readonly Post[]
  isLoading?: boolean
}

export function Feed({ posts, isLoading = false }: FeedProps) {
  if (isLoading) {
    return <p role="status">Loading posts…</p>
  }

  return (
    <>
      <CreatePost />
      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}