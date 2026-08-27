import type { UserIdentity } from '@/entities/user/@x/message';

export interface MessageSender extends UserIdentity {
  readonly id: string
  readonly username: string
}

export interface ChatMessage {
  readonly id: string
  readonly conversationId: string
  readonly sender: MessageSender
  readonly content: string
  readonly sentAt: number
}

export interface Conversation {
  readonly id: string
  readonly participant: MessageSender
  readonly messages: readonly ChatMessage[]
  readonly unreadCount: number
}
