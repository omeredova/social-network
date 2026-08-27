import { Outlet, useRouterState } from '@tanstack/react-router'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { AuthRedirect, useAuthSession } from '@/features/auth'
import { EchoChatProvider } from '@/features/chat'
import { Sidebar } from '@/widgets/sidebar'
import { SidebarProvider } from '@/shared/ui/sidebar'
import { ChatWidget } from '@/widgets/messages'
import { StatusMessage } from '@/shared/ui/status-message'

export const RootLayout: FC = observer(function RootLayout() {
  const session = useAuthSession()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isAuthRoute = pathname.startsWith('/account/')
  const isWidgetRoute = pathname === '/messages' || isAuthRoute

  if (session.isLoading && !isAuthRoute) {
    return <StatusMessage>Restoring your session...</StatusMessage>
  }

  if (!session.user && !isAuthRoute) {
    return <AuthRedirect />
  }

  if (isAuthRoute) {
    return (
      <>
        <Outlet />
        {!isWidgetRoute ? <ChatWidget /> : null}
      </>
    )
  }

  return (
    <EchoChatProvider>
      <SidebarProvider className="block min-h-screen md:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
        {!isWidgetRoute ? <ChatWidget /> : null}
      </SidebarProvider>
    </EchoChatProvider>
  )
})