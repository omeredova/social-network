import { usePosts } from '@/entities/post';
import { Feed } from '@/widgets/feed';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';

export function HomePage() {
  const postsQuery = usePosts()

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-2xl">
        <PageBreadcrumb items={[{ label: 'Feed' }]} />
        <Feed posts={postsQuery.data ?? []} isLoading={postsQuery.isLoading} />
        {postsQuery.isError ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            Unable to load posts. Please try again.
          </p>
        ) : null}
      </section>
    </main>
  )
}