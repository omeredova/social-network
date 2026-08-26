import { useState } from 'react';
import { MessageCircle, Users, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCurrentTime } from '@/shared/lib/useCurrentTime';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { StatusMessage } from '@/shared/ui/status-message';
import { useMessagesPanel } from '../model/useMessagesPanel';
import { ConversationAvatar } from './ConversationAvatar';
import { ConversationMessages } from './ConversationMessages';
import { MessageComposer } from './MessageComposer';

export const ChatWidget = observer(function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      {isOpen ? (
        <ChatWidgetPanel
          onClose={() => {
            setIsOpen(false)
          }}
        />
      ) : null}
      <Button
        type="button"
        size="icon"
        className="size-14 rounded-full bg-profile-accent text-white shadow-lg hover:bg-profile-accent/90"
        aria-label="Open chat"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open)
        }}
      >
        {isOpen ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
})

interface ChatWidgetPanelProps {
  readonly onClose: () => void
}

const ChatWidgetPanel = observer(function ChatWidgetPanel({
  onClose,
}: ChatWidgetPanelProps) {
  const currentTime = useCurrentTime()
  const panel = useMessagesPanel()
  const [isChoosingConversation, setIsChoosingConversation] = useState(true)
  const selectedConversation = panel.store.selectedConversation

  return (
    <Card
      className="mb-3 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] min-h-0 flex-col overflow-hidden rounded-xl border border-post-border bg-white shadow-xl"
      role="dialog"
      aria-label="Chat"
    >
      <header className="flex min-h-14 items-center gap-3 border-b border-post-border px-4">
        {!isChoosingConversation && selectedConversation ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Choose conversation"
            onClick={() => {
              setIsChoosingConversation(true)
            }}
          >
            <Users aria-hidden="true" />
          </Button>
        ) : null}
        <h2 className="min-w-0 flex-1 truncate font-semibold text-post-foreground">
          {!isChoosingConversation && selectedConversation
            ? selectedConversation.participant.name
            : 'Start a chat'}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close chat"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>
      </header>

      {panel.isLoading ? (
        <StatusMessage className="flex-1 p-6">
          Loading conversations…
        </StatusMessage>
      ) : panel.isError ? (
        <StatusMessage className="flex-1 p-6" tone="destructive">
          Conversations could not be loaded.
        </StatusMessage>
      ) : isChoosingConversation ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {panel.store.conversations.length === 0 ? (
            <StatusMessage className="p-6">
              No conversations available.
            </StatusMessage>
          ) : (
            panel.store.conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className="flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-post-toolbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
                onClick={() => {
                  panel.store.selectConversation(conversation.id)
                  setIsChoosingConversation(false)
                }}
              >
                <ConversationAvatar
                  participant={conversation.participant}
                  className="size-11"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-post-foreground">
                    {conversation.participant.name}
                  </span>
                  <span className="block truncate text-xs text-post-muted">
                    {conversation.latestMessage?.content ??
                      'Start a conversation'}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      ) : selectedConversation ? (
        <>
          <ConversationMessages
            conversation={selectedConversation}
            messages={panel.store.messages}
            registeredUser={panel.store.registeredUser}
            currentTime={currentTime}
          />
          <MessageComposer
            participantName={selectedConversation.participant.name}
            draft={panel.store.draft}
            status={panel.status}
            onDraftChange={(draft) => {
              panel.store.setDraft(draft)
            }}
            onSubmit={panel.submitMessage}
            onKeyDown={panel.handleComposerKeyDown}
          />
        </>
      ) : (
        <StatusMessage className="flex-1 p-6">
          No conversations available.
        </StatusMessage>
      )}
    </Card>
  )
})