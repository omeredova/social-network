import { Link } from '@tanstack/react-router';
import { Repeat2 } from 'lucide-react';

interface PostRepostAttributionProps {
  readonly authorId: string
  readonly author: string
}

export function PostRepostAttribution({
  authorId,
  author,
}: PostRepostAttributionProps) {
  return (
    <div className="relative z-20 flex items-center gap-1.5 px-5 pr-12 pt-4 text-xs text-post-muted">
      <Repeat2 className="size-3.5" aria-hidden="true" />
      <span>Reposted from</span>
      <Link
        to="/profile/$profileId"
        params={{ profileId: authorId }}
        className="font-medium text-post-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
      >
        {author}
      </Link>
    </div>
  )
}