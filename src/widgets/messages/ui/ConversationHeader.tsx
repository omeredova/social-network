import { Menu } from 'lucide-react';
import type { Conversation } from '@/entities/message';
import type { EchoConnectionStatus } from '@/features/chat';
import { AvatarBadge } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { ConversationAvatar } from './ConversationAvatar';

interface ConversationHeaderProps {
  readonly conversation: Conversation
  readonly status: EchoConnectionStatus
  readonly isConversationListOpen: boolean
  readonly onOpenConversationList: () => void
}

const statusPresentation: Record<
  EchoConnectionStatus,
  { readonly className: string; readonly label: string }
> = {
  connected: {
    className: 'border-white bg-profile-accent',
    label: 'Connected',
  },
  error: {
    className: 'border-white bg-destructive',
    label: 'Connection error, retrying',
  },
  connecting: { className: 'border-white bg-post-muted', label: 'Connecting' },
  disconnected: {
    className: 'border-white bg-post-muted',
    label: 'Connecting',
  },
}

export function ConversationHeader({
  conversation,
  status,
  isConversationListOpen,
  onOpenConversationList,
}: ConversationHeaderProps) {
  const connection = statusPresentation[status]
  return (
    <header className="flex items-center gap-3 border-b border-post-border px-4 py-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        aria-label="Open conversations"
        aria-expanded={isConversationListOpen}
        onClick={onOpenConversationList}
      >
        <Menu aria-hidden="true" />
      </Button>
      <div className="relative shrink-0">
        <ConversationAvatar
          participant={conversation.participant}
          className="size-10"
        />
        <AvatarBadge
          className={connection.className}
          role="status"
          aria-label={connection.label}
        />
      </div>
      <h2 className="font-semibold text-post-foreground">
        {conversation.participant.name}
      </h2>
    </header>
  )
}