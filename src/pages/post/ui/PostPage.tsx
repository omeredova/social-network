import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { usePost } from '@/entities/post';
import { InteractivePostCard, PostComments } from '@/widgets/post';
import { Button } from '@/shared/ui/button';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';
import { NotFoundState } from '@/shared/ui/not-found-state';
import { PageContainer } from '@/shared/ui/page-container';
import { StatusMessage } from '@/shared/ui/status-message';

interface PostPageProps {
  postId: string
}

export function PostPage({ postId }: PostPageProps) {
  const postQuery = usePost(postId)
  const [focusRequest, setFocusRequest] = useState(0)
  const post = postQuery.data

  if (postQuery.isLoading) {
    return <StatusMessage className="p-10">Loading post…</StatusMessage>
  }

  if (!post) {
    return (
      <NotFoundState
        title={postQuery.isError ? 'Unable to load post' : 'Post not found'}
        action={
          <Button asChild variant="link" className="mt-4">
            <Link to="/">Return to the feed</Link>
          </Button>
        }
      />
    )
  }

  return (
    <PageContainer>
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
    </PageContainer>
  )
}