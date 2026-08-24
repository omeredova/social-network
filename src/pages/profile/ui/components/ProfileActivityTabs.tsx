import { MessagesSquare } from 'lucide-react'
import type { UserProfile } from '@/entities/user'
import { CommentCard } from '@/entities/comment'
import { InteractivePostCard } from '@/features/update-post'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

interface ProfileActivityTabsProps {
  profile: UserProfile
}

export function ProfileActivityTabs({ profile }: ProfileActivityTabsProps) {
  return (
    <Tabs
      defaultSelectedKey="posts"
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
          <Card className="rounded-profile-card border-post-border bg-post-surface px-5 shadow-post-card">
            {profile.comments.length > 0 ? (
              profile.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="grid place-items-center gap-2 py-10 text-center text-post-muted">
                <MessagesSquare className="size-6" aria-hidden="true" />
                <p className="text-sm">No comments yet</p>
              </div>
            )}
          </Card>
        </section>
      </TabsContent>
    </Tabs>
  )
}