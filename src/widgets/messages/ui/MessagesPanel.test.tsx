import { useState } from 'react'
import { makeAutoObservable } from 'mobx'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ChatMessage, MessageSender } from '@/entities/message'
import type { UserProfile } from '@/entities/user'
import type { EchoMessagePayload } from '@/features/chat'
import { MessagesPanel } from './MessagesPanel'

const participantQuery = vi.hoisted(() => ({
  data: [
    {
      id: 'registered-user',
      name: 'Ava Registered',
      username: 'ava',
      photoUrl: '',
    },
    {
      id: 'jack-user',
      name: 'Jack User',
      username: 'jack.user',
      photoUrl: '',
    },
  ],
  isLoading: false,
  isError: false,
}))

const authSession = vi.hoisted(() => ({ userId: 'registered-user' }))

vi.mock('@/entities/message', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/entities/message')>()
  return {
    ...original,
    useMessageParticipants: () => participantQuery,
  }
})

vi.mock('@/shared/ui/message-scroller', () => ({
  MessageScrollerProvider: 'div',
  MessageScroller: 'div',
  MessageScrollerViewport: 'div',
  MessageScrollerContent: 'div',
  MessageScrollerItem: 'div',
  MessageScrollerButton: 'button',
}))

vi.mock('@/features/auth', () => ({
  useAuthUser: () => ({
    user: {
      uid: authSession.userId,
      email: 'ava@example.com',
      displayName: 'Ava Registered',
      photoURL: 'https://example.com/ava.jpg',
    },
    isLoading: false,
  }),
}))

vi.mock('@/features/chat', () => ({
  useEchoChat: () => {
    const [chat] = useState(() =>
      makeAutoObservable(
        {
          messages: [] as ChatMessage[],
          status: 'connected' as const,
          connect(): void {
            return undefined
          },
          disconnect(): void {
            return undefined
          },
          sendMessage(
            payload: EchoMessagePayload,
            localSender: MessageSender,
          ): boolean {
            this.messages = [
              ...this.messages,
              { ...payload, id: `sent-${payload.id}`, sender: localSender },
              { ...payload, id: `echo-${payload.id}` },
            ]
            return true
          },
        },
        {},
        { autoBind: true },
      ),
    )
    return chat
  },
}))

afterEach(() => {
  cleanup()
  authSession.userId = 'registered-user'
})

describe('MessagesPanel', () => {
  it('removes the authenticated user after session restoration', async () => {
    authSession.userId = ''
    const { rerender } = render(<MessagesPanel />)

    expect(
      screen.getByRole('button', { name: /Ava Registered/ }),
    ).toBeInTheDocument()

    authSession.userId = 'registered-user'
    rerender(<MessagesPanel initialProfile={null} />)

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /Ava Registered/ }),
      ).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Jack User' })).toBeVisible()
  })

  it('starts a conversation with a profile selected from navigation', () => {
    const profile: UserProfile = {
      id: 'new-user',
      name: 'New User',
      username: 'new.user',
      description: '',
      photoUrl: '',
      photoAlt: 'New User',
      coverUrl: '',
      postsCount: 0,
      posts: [],
    }

    render(<MessagesPanel initialProfile={profile} />)

    expect(screen.getByRole('heading', { name: 'New User' })).toBeVisible()
    expect(screen.getByLabelText('Message')).toHaveAttribute(
      'placeholder',
      'Message New User',
    )
    expect(screen.getByText('Start a conversation with New User')).toBeVisible()
    expect(
      screen.getByText('Send a message to begin this conversation.'),
    ).toBeVisible()
  })

  it('shows a sent message in the conversation preview', async () => {
    const user = userEvent.setup()
    const profile: UserProfile = {
      id: 'new-user',
      name: 'New User',
      username: 'new.user',
      description: '',
      photoUrl: '',
      photoAlt: 'New User',
      coverUrl: '',
      postsCount: 0,
      posts: [],
    }
    render(<MessagesPanel initialProfile={profile} />)

    await user.type(screen.getByLabelText('Message'), 'Hello there')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    const conversation = screen.getByRole('button', { name: /New User/ })
    expect(within(conversation).getByText('Hello there')).toBeVisible()
  })

  it('sends with Enter and inserts a newline with Shift+Enter', async () => {
    const user = userEvent.setup()
    render(<MessagesPanel />)
    const composer = screen.getByLabelText('Message')

    await user.type(composer, 'Sent with Enter{Enter}')

    expect(composer).toHaveValue('')
    expect(screen.getAllByText('Sent with Enter')).toHaveLength(3)

    await user.type(composer, 'First line{Shift>}{Enter}{/Shift}Second line')

    expect(composer).toHaveValue('First line\nSecond line')
  })

  it('opens the collapsed conversation list from the chat header', async () => {
    const user = userEvent.setup()
    render(<MessagesPanel />)

    const menuButton = screen.getByRole('button', {
      name: 'Open conversations',
    })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('status', { name: 'Connected' })).toBeVisible()
  })

  it('switches conversations and sends a WebSocket message', async () => {
    const user = userEvent.setup()
    render(<MessagesPanel />)

    await user.click(screen.getByRole('button', { name: /Jack User/ }))
    expect(
      screen.getByRole('heading', { name: 'Jack User' }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('Message'), 'See you there!')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(screen.getAllByText('See you there!')).toHaveLength(3)
    expect(screen.getAllByText('Ava Registered').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Message')).toHaveValue('')
  })

  it('filters the conversation list by sender name', async () => {
    const user = userEvent.setup()
    render(<MessagesPanel />)

    await user.type(screen.getByLabelText('Search conversations'), 'Jack')

    expect(
      screen.getByRole('button', { name: /Jack User/ }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /New User/ }),
    ).not.toBeInTheDocument()
  })
})
