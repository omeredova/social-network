import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RootLayout } from './RootLayout'

const authSession = vi.hoisted(() => ({
  isLoading: true,
  user: null as { readonly uid: string } | null,
}))

const replaceMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div>Protected content</div>,
  useRouterState: () => '/',
}))

vi.mock('@/features/auth/model/useAuthSession', () => ({
  useAuthSession: () => authSession,
}))

vi.mock('@/features/auth/ui/AuthRedirect', () => ({
  AuthRedirect: () => {
    replaceMock('/account/login')
    return <div>Redirecting to login...</div>
  },
}))

vi.mock('@/features/chat', () => ({
  EchoChatProvider: ({ children }: { readonly children: ReactNode }) => children,
}))

vi.mock('@/widgets/sidebar', () => ({ Sidebar: () => null }))
vi.mock('@/shared/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { readonly children: ReactNode }) => children,
}))
vi.mock('@/widgets/messages', () => ({ ChatWidget: () => null }))

describe('RootLayout authentication guard', () => {
  beforeEach(() => {
    authSession.isLoading = true
    authSession.user = null
    replaceMock.mockClear()
  })

  it('waits for session restoration before deciding to redirect', () => {
    const view = render(<RootLayout />)

    expect(screen.getByText('Restoring your session...')).toBeInTheDocument()
    expect(replaceMock).not.toHaveBeenCalled()

    authSession.isLoading = false
    authSession.user = { uid: 'registered-user' }
    view.unmount()
    render(<RootLayout />)

    expect(screen.getByText('Protected content')).toBeInTheDocument()
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('redirects after session restoration confirms there is no user', () => {
    authSession.isLoading = false

    render(<RootLayout />)

    expect(screen.getByText('Redirecting to login...')).toBeInTheDocument()
    expect(replaceMock).toHaveBeenCalledWith('/account/login')
  })
})
