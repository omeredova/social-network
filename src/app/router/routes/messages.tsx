import { createFileRoute } from '@tanstack/react-router';
import { MessagesPage } from '@/pages/messages';

interface MessagesSearch {
  readonly userId?: string
}

export const Route = createFileRoute('/messages')({
  validateSearch: (search: Record<string, unknown>): MessagesSearch => {
    const userId = typeof search.userId === 'string' ? search.userId : null
    return userId ? { userId } : {}
  },
  component: MessagesPage,
})