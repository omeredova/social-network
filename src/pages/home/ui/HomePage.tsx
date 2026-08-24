import { usePosts } from '@/entities/post';
import { Feed } from '@/widgets/feed';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';
import { PageContainer } from '@/shared/ui/page-container';
import { StatusMessage } from '@/shared/ui/status-message';

export function HomePage() {
  const postsQuery = usePosts()

  return (
    <PageContainer>
      <PageBreadcrumb items={[{ label: 'Feed' }]} />
      <Feed posts={postsQuery.data ?? []} isLoading={postsQuery.isLoading} />
      {postsQuery.isError ? (
        <StatusMessage tone="destructive" className="mt-4">
          Unable to load posts. Please try again.
        </StatusMessage>
      ) : null}
    </PageContainer>
  )
}