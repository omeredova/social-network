import { useSearch } from '@tanstack/react-router';
import { useUserProfile } from '@/entities/user';
import { MessagesPanel } from '@/widgets/messages';
import { PageContainer } from '@/shared/ui/page-container';

export function MessagesPage() {
  const { userId } = useSearch({ from: '/messages' })
  const { data: initialProfile } = useUserProfile(userId ?? null)

  return (
    <PageContainer contentClassName="max-w-5xl">
      <MessagesPanel
        key={initialProfile?.id ?? 'messages'}
        initialProfile={initialProfile ?? null}
      />
    </PageContainer>
  )
}