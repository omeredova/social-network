import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { usePost } from '@/entities/post';
import { PostComments } from '@/features/create-comment';
import { InteractivePostCard } from '@/features/update-post';
import { Button } from '@/shared/ui/button';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';

interface PostPageProps {
  postId: string
}

export function PostPage({ postId }: PostPageProps) {
  const postQuery = usePost(postId)
  const [focusRequest, setFocusRequest] = useState(0)
  const post = postQuery.data

  if (postQuery.isLoading) {
    return (
      <p role="status" className="p-10">
        Loading post…
      </p>
    )
  }

  if (!post) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-4xl">
            {postQuery.isError ? 'Unable to load post' : 'Post not found'}
          </h1>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">Return to the feed</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-2xl">
        <PageBreadcrumb
          items={[
            { label: 'Feed', href: '/' },
            { label: `${post.author}'s post` },
          ]}
        />
        <InteractivePostCard
          post={post}
          onComment={() => {
            setFocusRequest((current) => current + 1)
          }}
        />
        <div className="mt-3">
          <PostComments
            postId={post.id}
            commentsCount={post.comments}
            focusRequest={focusRequest}
          />
        </div>
      </section>
    </main>
  )
}