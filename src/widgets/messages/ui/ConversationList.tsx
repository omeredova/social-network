import { Search, X } from 'lucide-react';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import type { ConversationPreview } from '../model/MessagesPanelStore';
import { ConversationAvatar } from './ConversationAvatar';

interface ConversationListProps {
  readonly conversations: readonly ConversationPreview[]
  readonly selectedId: string | null
  readonly query: string
  readonly currentTime: number
  readonly isOpen: boolean
  readonly onQueryChange: (query: string) => void
  readonly onSelect: (id: string) => void
  readonly onClose: () => void
}

export function ConversationList({
  conversations,
  selectedId,
  query,
  currentTime,
  isOpen,
  onQueryChange,
  onSelect,
  onClose,
}: ConversationListProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="absolute inset-0 z-10 bg-black/25 lg:hidden"
          aria-label="Close conversations"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`absolute inset-y-0 left-0 z-20 flex w-full min-h-0 flex-col border-r border-post-border bg-white shadow-lg transition-transform sm:w-80 lg:static lg:w-auto lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-post-border p-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-post-foreground">
              Messages
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Close conversations"
              onClick={onClose}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-post-muted"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => {
                onQueryChange(event.target.value)
              }}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="pl-9"
            />
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-1 p-2 md:overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                onSelect(conversation.id)
              }}
              className={`flex h-20 min-w-0 items-center gap-3 rounded-lg px-3 text-left transition-colors ${conversation.id === selectedId ? 'bg-post-toolbar' : 'hover:bg-post-toolbar/60'}`}
              aria-pressed={conversation.id === selectedId}
            >
              <ConversationAvatar
                participant={conversation.participant}
                className="size-11"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-post-foreground">
                    {conversation.participant.name}
                  </span>
                  <span className="shrink-0 text-xs text-post-muted">
                    {conversation.latestMessage
                      ? formatRelativeTime(
                          new Date(conversation.latestMessage.sentAt),
                          currentTime,
                        )
                      : null}
                  </span>
                </span>
                <span className="mt-1 flex items-center justify-between gap-2 text-xs text-post-muted">
                  <span className="min-w-0 truncate">
                    {conversation.latestMessage?.content}
                  </span>
                  {conversation.unreadCount ? (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-white">
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}