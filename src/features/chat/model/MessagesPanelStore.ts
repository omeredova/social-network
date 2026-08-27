import { makeAutoObservable } from 'mobx'
import {
  type ChatMessage,
  type Conversation,
  type MessageSender,
} from '@/entities/message'
import type { UserProfile } from '@/entities/user'
import type { EchoChatState } from './EchoChatStore'

export interface ConversationPreview extends Conversation {
  readonly latestMessage: ChatMessage | undefined
}

function createProfileConversation(
  profile: UserProfile | MessageSender,
): Conversation {
  return {
    id: `profile-${profile.id}`,
    participant: {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      photoUrl: profile.photoUrl,
    },
    messages: [],
    unreadCount: 0,
  }
}

export class MessagesPanelStore {
  query = ''
  draft = ''
  isConversationListOpen = false
  selectedConversationId: string | null
  registeredUser: MessageSender

  private baseConversations: readonly Conversation[] = []
  private participants: readonly MessageSender[]
  private initialProfile: UserProfile | null
  private readonly chat: EchoChatState

  constructor(
    chat: EchoChatState,
    registeredUser: MessageSender,
    participants: readonly MessageSender[],
    initialProfile?: UserProfile | null,
  ) {
    this.chat = chat
    this.registeredUser = registeredUser
    this.participants = participants
    this.initialProfile = initialProfile ?? null
    this.baseConversations = this.createConversations()
    this.selectedConversationId = this.getInitialConversationId()

    makeAutoObservable<
      this,
      'baseConversations' | 'chat' | 'initialProfile' | 'participants'
    >(
      this,
      {
        baseConversations: true,
        chat: false,
        initialProfile: false,
        participants: false,
      },
      { autoBind: true },
    )
  }

  get conversations(): readonly ConversationPreview[] {
    const normalizedQuery = this.query.trim().toLowerCase()

    return this.baseConversations
      .filter(
        ({ participant }) =>
          !normalizedQuery ||
          participant.name.toLowerCase().includes(normalizedQuery),
      )
      .map((conversation) => ({
        ...conversation,
        latestMessage:
          this.chat.messages
            .filter(({ conversationId }) => conversationId === conversation.id)
            .at(-1) ?? conversation.messages.at(-1),
      }))
  }

  get selectedConversation(): Conversation | null {
    return (
      this.baseConversations.find(
        ({ id }) => id === this.selectedConversationId,
      ) ??
      this.baseConversations[0] ??
      null
    )
  }

  get messages(): readonly ChatMessage[] {
    return [
      ...(this.selectedConversation?.messages ?? []),
      ...this.chat.messages.filter(
        ({ conversationId }) =>
          conversationId === this.selectedConversation?.id,
      ),
    ]
  }

  setRegisteredUser(user: MessageSender): void {
    this.registeredUser = user
    this.rebuildConversations()
  }

  setParticipants(
    participants: readonly MessageSender[],
    initialProfile?: UserProfile | null,
  ): void {
    this.participants = participants
    this.initialProfile = initialProfile ?? null
    this.rebuildConversations()
  }

  setQuery(query: string): void {
    this.query = query
  }

  setDraft(draft: string): void {
    this.draft = draft
  }

  openConversationList(): void {
    this.isConversationListOpen = true
  }

  closeConversationList(): void {
    this.isConversationListOpen = false
  }

  selectConversation(id: string): void {
    this.selectedConversationId = id
    this.closeConversationList()
  }

  sendDraft(sentAt: number): boolean {
    const content = this.draft.trim()
    const conversation = this.selectedConversation
    if (!content || !conversation) return false

    const wasSent = this.chat.sendMessage(
      {
        id: crypto.randomUUID(),
        conversationId: conversation.id,
        content,
        sender: conversation.participant,
        sentAt,
      },
      this.registeredUser,
    )

    if (wasSent) this.draft = ''
    return wasSent
  }

  private createConversations(): readonly Conversation[] {
    const profiles =
      this.initialProfile &&
      !this.participants.some(({ id }) => id === this.initialProfile?.id)
        ? [this.initialProfile, ...this.participants]
        : this.participants

    return profiles
      .filter(({ id }) => id !== this.registeredUser.id)
      .map(createProfileConversation)
  }

  private rebuildConversations(): void {
    this.baseConversations = this.createConversations()
    const selectedConversationStillExists = this.baseConversations.some(
      ({ id }) => id === this.selectedConversationId,
    )
    if (!selectedConversationStillExists) {
      this.selectedConversationId = this.getInitialConversationId()
    }
  }

  private getInitialConversationId(): string | null {
    return (
      this.baseConversations.find(
        ({ participant }) => participant.id === this.initialProfile?.id,
      )?.id ??
      this.baseConversations[0]?.id ??
      null
    )
  }
}
