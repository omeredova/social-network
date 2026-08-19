import { Outlet, useRouterState } from '@tanstack/react-router'
import { Sidebar } from '@/widgets/sidebar'
import { SidebarProvider } from '@/shared/ui/sidebar'

export function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isAuthRoute = pathname.startsWith('/account/')

  if (isAuthRoute) return <Outlet />

  return (
    <SidebarProvider className="block min-h-screen md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </SidebarProvider>
  )
}