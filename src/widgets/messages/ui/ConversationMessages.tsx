import { CheckCheck } from 'lucide-react'
import {
  type ChatMessage,
  type Conversation,
  type MessageSender,
} from '@/entities/message'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/empty'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '@/shared/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/shared/ui/message-scroller';
import { ConversationAvatar } from './ConversationAvatar';

interface ConversationMessagesProps {
  readonly conversation: Conversation
  readonly messages: readonly ChatMessage[]
  readonly registeredUser: MessageSender
  readonly currentTime: number
}

export function ConversationMessages({
  conversation,
  messages,
  registeredUser,
  currentTime,
}: ConversationMessagesProps) {
  return (
    <MessageScrollerProvider
      key={conversation.id}
      autoScroll
      defaultScrollPosition="end"
    >
      <MessageScroller className="min-w-0 flex-1 bg-post-toolbar/40">
        <MessageScrollerViewport className="overflow-x-hidden">
          <MessageScrollerContent className="p-4 sm:p-6">
            {messages.length === 0 ? (
              <Empty className="min-h-full border-0">
                <EmptyHeader>
                  <EmptyMedia className="size-16 rounded-full bg-transparent">
                    <ConversationAvatar
                      participant={conversation.participant}
                      className="size-16 text-lg"
                    />
                  </EmptyMedia>
                  <EmptyTitle>
                    Start a conversation with {conversation.participant.name}
                  </EmptyTitle>
                  <EmptyDescription>
                    Send a message to begin this conversation.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}
            {messages.map((chatMessage) => {
              const isCurrentUser = chatMessage.sender.id === registeredUser.id
              const sender = isCurrentUser ? registeredUser : chatMessage.sender
              return (
                <MessageScrollerItem
                  key={chatMessage.id}
                  messageId={chatMessage.id}
                  scrollAnchor={isCurrentUser}
                >
                  <Message align={isCurrentUser ? 'end' : 'start'}>
                    <MessageAvatar>
                      <ConversationAvatar participant={sender} />
                    </MessageAvatar>
                    <MessageContent className="max-w-[85%] sm:max-w-[70%]">
                      <MessageHeader>{sender.name}</MessageHeader>
                      <p
                        className={`max-w-full min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere] rounded-2xl px-4 py-2.5 leading-relaxed shadow-sm ${isCurrentUser ? 'rounded-br-sm bg-profile-accent text-white' : 'rounded-bl-sm border border-post-border bg-white text-post-foreground'}`}
                      >
                        {chatMessage.content}
                      </p>
                      <MessageFooter>
                        {formatRelativeTime(
                          new Date(chatMessage.sentAt),
                          currentTime,
                        )}
                        {isCurrentUser ? (
                          <CheckCheck
                            className="ml-1 size-3.5"
                            aria-label="Read"
                          />
                        ) : null}
                      </MessageFooter>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )
            })}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton aria-label="Scroll to latest message" />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
