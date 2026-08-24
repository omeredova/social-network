import { usePosts } from '@/entities/post';
import { Feed } from '@/widgets/feed';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';
import { PageContainer } from '@/shared/ui/page-container';
import { StatusMessage } from '@/shared/ui/status-message';

export function HomePage() {
  const postsQuery = usePosts()
  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? []

  return (
    <PageContainer>
      <PageBreadcrumb items={[{ label: 'Feed' }]} />
      <Feed
        posts={posts}
        isLoading={postsQuery.isLoading}
        hasNextPage={postsQuery.hasNextPage}
        isFetchingNextPage={postsQuery.isFetchingNextPage}
        onLoadMore={() => void postsQuery.fetchNextPage()}
      />
      {postsQuery.isError ? (
        <StatusMessage tone="destructive" className="mt-4">
          Unable to load posts. Please try again.
        </StatusMessage>
      ) : null}
    </PageContainer>
  )
}