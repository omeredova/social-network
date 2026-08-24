import { useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import type { UserProfile } from '@/entities/user'
import {
  CommentCard,
  type Comment,
  useCommentsByAuthor,
} from '@/entities/comment'
import { usePost } from '@/entities/post'
import { InteractivePostCard } from '@/features/update-post'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

interface ProfileActivityTabsProps {
  profile: UserProfile
}

export function ProfileActivityTabs({ profile }: ProfileActivityTabsProps) {
  const [selectedTab, setSelectedTab] = useState<'posts' | 'comments'>('posts')
  const commentsQuery = useCommentsByAuthor(
    profile.id,
    selectedTab === 'comments',
  )

  return (
    <Tabs
      selectedKey={selectedTab}
      onSelectionChange={(key) => {
        setSelectedTab(key === 'comments' ? 'comments' : 'posts')
      }}
      className="mt-6"
      aria-label="Profile activity"
    >
      <TabsList
        variant="line"
        className="w-full justify-start border-b border-post-border p-0"
      >
        <TabsTrigger
          id="posts"
          className="h-11 flex-none cursor-pointer rounded-none px-5 text-post-muted after:bg-profile-accent data-selected:text-post-foreground"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          id="comments"
          className="h-11 flex-none cursor-pointer rounded-none px-5 text-post-muted after:bg-profile-accent data-selected:text-post-foreground"
        >
          Comments
        </TabsTrigger>
      </TabsList>

      <TabsContent id="posts" className="mx-auto mt-6 max-w-2xl">
        <section aria-label="User posts" className="space-y-5">
          {profile.posts.length > 0 ? (
            profile.posts.map((post) => (
              <InteractivePostCard key={post.id} post={post} linked />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-post-muted">
              No posts yet.
            </p>
          )}
        </section>
      </TabsContent>

      <TabsContent id="comments" className="mx-auto mt-6 max-w-2xl">
        <section aria-label="User comments">
          <div className="space-y-5">
            {commentsQuery.isLoading ? (
              <p
                role="status"
                className="py-10 text-center text-sm text-post-muted"
              >
                Loading comments…
              </p>
            ) : commentsQuery.isError ? (
              <p
                role="alert"
                className="py-10 text-center text-sm text-destructive"
              >
                Unable to load comments.
              </p>
            ) : commentsQuery.data && commentsQuery.data.length > 0 ? (
              commentsQuery.data.map((comment) => (
                <CommentedPost key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="grid place-items-center gap-2 py-10 text-center text-post-muted">
                <MessagesSquare className="size-6" aria-hidden="true" />
                <p className="text-sm">No comments yet</p>
              </div>
            )}
          </div>
        </section>
      </TabsContent>
    </Tabs>
  )
}

interface CommentedPostProps {
  readonly comment: Comment
}

function CommentedPost({ comment }: CommentedPostProps) {
  const postQuery = usePost(comment.postId)

  return (
    <article
      className="[&>div:first-child>div]:rounded-b-none"
      aria-label="Original post with selected user comment"
    >
      {postQuery.isLoading ? (
        <Card className="rounded-profile-card border-post-border bg-post-surface p-5 shadow-post-card">
          <p role="status" className="text-sm text-post-muted">
            Loading commented post…
          </p>
        </Card>
      ) : postQuery.isError ? (
        <Card className="rounded-profile-card border-post-border bg-post-surface p-5 shadow-post-card">
          <p role="alert" className="text-sm text-destructive">
            Unable to load the commented post.
          </p>
        </Card>
      ) : postQuery.data ? (
        <InteractivePostCard
          post={postQuery.data}
          linked
          onComment={() => undefined}
        />
      ) : (
        <Card className="rounded-profile-card border-post-border bg-post-surface p-5 shadow-post-card">
          <p className="text-sm text-post-muted">This post is no longer available.</p>
        </Card>
      )}

      <Card className="rounded-t-none rounded-b-post-card border-post-border border-t-0 bg-post-surface px-5 shadow-post-card">
        <p className="pt-3 text-xs font-medium uppercase tracking-wide text-post-muted">
          Selected comment
        </p>
        <CommentCard comment={comment} />
      </Card>
    </article>
  )
}