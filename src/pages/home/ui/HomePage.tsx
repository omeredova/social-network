import { postsMock } from '@/entities/post';
import { Feed } from '@/widgets/feed';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';

export function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-2xl">
        <PageBreadcrumb items={[{ label: 'Feed' }]} />
        <Feed posts={postsMock} />
      </section>
    </main>
  )
}