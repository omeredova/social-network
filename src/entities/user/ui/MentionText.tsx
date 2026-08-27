import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';

interface MentionTextProps {
  readonly text: string
}

const mentionPattern = /(^|\s)(@[\p{L}\p{N}_.-]+)/gu

export function MentionText({ text }: MentionTextProps) {
  const parts = text.split(mentionPattern)

  return parts.map((part, index) => {
    if (!part.startsWith('@')) {
      return <Fragment key={`${part}-${String(index)}`}>{part}</Fragment>
    }

    return (
      <Link
        key={`${part}-${String(index)}`}
        to="/profile/$profileId"
        params={{ profileId: part.slice(1) }}
        className="relative z-20 font-medium text-post-action-link hover:text-post-action-link-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
      >
        {part}
      </Link>
    )
  })
}
