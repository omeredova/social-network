import { useState } from 'react'
import type { Post } from '@/entities/post'
import { InteractivePostCard } from '@/widgets/post'
import { StatusMessage } from '@/shared/ui/status-message'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ProfileCommentsTab } from './ProfileCommentsTab'

interface ProfileActivityTabsProps {
  readonly profileId: string
  readonly posts: readonly Post[]
  readonly isPostsLoading: boolean
  readonly isPostsError: boolean
}

export function ProfileActivityTabs({
  profileId,
  posts,
  isPostsLoading,
  isPostsError,
}: ProfileActivityTabsProps) {
  const [selectedTab, setSelectedTab] = useState<'posts' | 'comments'>('posts')
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
          {isPostsLoading ? (
            <StatusMessage>Loading posts…</StatusMessage>
          ) : isPostsError ? (
            <StatusMessage tone="destructive">
              Unable to load posts.
            </StatusMessage>
          ) : posts.length > 0 ? (
            posts.map((post) => (
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
          {selectedTab === 'comments' ? (
            <ProfileCommentsTab profileId={profileId} />
          ) : null}
        </section>
      </TabsContent>
    </Tabs>
  )
}
