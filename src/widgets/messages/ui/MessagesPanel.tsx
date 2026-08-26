import type { UserProfile } from '@/entities/user';
import { observer } from 'mobx-react-lite';
import { useCurrentTime } from '@/shared/lib/useCurrentTime';
import { Card } from '@/shared/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/empty';
import { StatusMessage } from '@/shared/ui/status-message';
import { useMessagesPanel } from '../model/useMessagesPanel';
import { ConversationHeader } from './ConversationHeader';
import { ConversationList } from './ConversationList';
import { ConversationMessages } from './ConversationMessages';
import { MessageComposer } from './MessageComposer';

interface MessagesPanelProps {
  readonly initialProfile?: UserProfile | null
}

export const MessagesPanel = observer(function MessagesPanel({
  initialProfile,
}: MessagesPanelProps) {
  const currentTime = useCurrentTime()
  const panel = useMessagesPanel(initialProfile)
  const { store } = panel
  const selectedConversation = store.selectedConversation

  if (panel.isLoading) {
    return <StatusMessage className="p-6">Loading conversations…</StatusMessage>
  }

  if (panel.isError) {
    return (
      <StatusMessage className="p-6" tone="destructive">
        Conversations could not be loaded.
      </StatusMessage>
    )
  }

  return (
    <Card
      className="relative grid h-[calc(100dvh-9rem)] min-h-0 min-w-0 overflow-hidden rounded-xl border border-post-border bg-white shadow-post-card lg:grid-cols-[17rem_minmax(0,1fr)]"
      role="region"
      aria-label="Messages"
    >
      <ConversationList
        conversations={store.conversations}
        selectedId={selectedConversation?.id ?? null}
        query={store.query}
        currentTime={currentTime}
        isOpen={store.isConversationListOpen}
        onQueryChange={(query) => {
          store.setQuery(query)
        }}
        onSelect={(id) => {
          store.selectConversation(id)
        }}
        onClose={() => {
          store.closeConversationList()
        }}
      />
      {selectedConversation ? (
        <div className="flex min-h-0 min-w-0 flex-col">
          <ConversationHeader
            conversation={selectedConversation}
            status={panel.status}
            isConversationListOpen={store.isConversationListOpen}
            onOpenConversationList={() => {
              store.openConversationList()
            }}
          />
          <ConversationMessages
            conversation={selectedConversation}
            messages={store.messages}
            registeredUser={store.registeredUser}
            currentTime={currentTime}
          />
          <MessageComposer
            participantName={selectedConversation.participant.name}
            draft={store.draft}
            status={panel.status}
            onDraftChange={(draft) => {
              store.setDraft(draft)
            }}
            onSubmit={panel.submitMessage}
            onKeyDown={panel.handleComposerKeyDown}
          />
        </div>
      ) : (
        <Empty className="min-h-0 border-0">
          <EmptyHeader>
            <EmptyTitle>No conversations available</EmptyTitle>
            <EmptyDescription>
              Other registered users will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </Card>
  )
})