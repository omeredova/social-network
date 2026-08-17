import { postsMock } from '@/entities/post';
import { Feed } from '@/widgets/feed';

export function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-2xl">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl">
              The feed
            </h1>
          </div>
        </header>
        <Feed posts={postsMock} />
      </section>
    </main>
  )
}