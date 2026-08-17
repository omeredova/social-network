import { Link } from '@tanstack/react-router';
import { CommentCard, PostCard, commentsByPostId, postsMock } from '@/entities/post';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { MessageCircle } from 'lucide-react';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

interface PostPageProps {
  postId: string
}

export function PostPage({ postId }: PostPageProps) {
  const post = postsMock.find((item) => item.id === postId)

  if (!post) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-4xl">Post not found</h1>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">Return to the feed</Link>
          </Button>
        </div>
      </main>
    )
  }

  const comments = commentsByPostId[post.id] ?? []

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-2xl">

        <PostCard post={post} />

        <section className="mt-3 bg-post-toolbar px-4 py-5 sm:px-5" aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="mb-1 font-serif text-2xl">
            Comments <span className="ml-1 text-base font-normal text-post-muted">{post.comments}</span>
          </h2>
          {comments.length > 0 ? (
            comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyMedia>
                  <MessageCircle aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No comments yet</EmptyTitle>
                <EmptyDescription>Be the first to join the conversation.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <div className="mt-3 flex items-center gap-3 border-t border-post-border pt-4">
            <Avatar>
              <AvatarFallback className="bg-post-foreground text-[10px] font-semibold text-white">YO</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Add comment"
              aria-label="Add comment"
              className="h-9 flex-1 border-0 bg-post-surface text-sm shadow-none focus-visible:ring-post-focus"
            />
          </div>
        </section>
      </section>
    </main>
  )
}