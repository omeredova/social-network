import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { UserProfile } from '@/entities/user'
import { ProfilePage } from './ProfilePage'

const authMock = vi.hoisted(() => ({ userId: 'registered-user' }))

const profile: UserProfile = {
  id: 'registered-user',
  name: 'Registered User',
  username: 'registered.user',
  description: 'Profile description',
  photoUrl: '',
  photoAlt: 'Registered User',
  coverUrl: '',
  postsCount: 0,
  posts: [],
}

vi.mock('@/entities/user', () => ({
  useUserProfile: (profileId: string) => ({
    data: { ...profile, id: profileId },
    isLoading: false,
    isError: false,
  }),
}))

vi.mock('@/features/auth', () => ({
  useAuthUser: () => ({
    user: {
      uid: authMock.userId,
      email: 'registered@example.com',
      displayName: 'Registered User',
      photoURL: '',
    },
    isLoading: false,
  }),
}))

vi.mock('@/features/repost-profile', () => ({
  useRepostProfile: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  }),
}))

vi.mock('@/features/message-user', () => ({
  MessageUserLink: () => <button type="button">Message</button>,
}))

vi.mock('@/shared/ui/page-breadcrumb', () => ({
  PageBreadcrumb: () => null,
}))

vi.mock('./components/ProfileActivityTabs', () => ({
  ProfileActivityTabs: () => null,
}))

afterEach(cleanup)

describe('ProfilePage actions', () => {
  it('removes the message action from the registered user profile', () => {
    render(<ProfilePage profileId="registered-user" />)

    expect(
      screen.queryByRole('button', { name: 'Message' }),
    ).not.toBeInTheDocument()
  })

  it('shows the message action on another user profile', () => {
    render(<ProfilePage profileId="tom-holland" />)

    expect(screen.getByRole('button', { name: 'Message' })).toBeVisible()
  })
})
