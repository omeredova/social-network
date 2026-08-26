import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { User, Mail, Settings, LogOut, Menu, X } from 'lucide-react';
import { useLogoutAction } from '@/features/auth/logout';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { useAuthUser } from '@/features/auth';

const menuButtonClassName =
  'h-auto min-h-11 gap-3 rounded-md px-3 text-sm font-medium text-white hover:bg-white/10 md:min-h-0 md:gap-1 md:rounded-none md:px-2 md:hover:bg-sidebar'

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoading: isAuthLoading } = useAuthUser()
  const { logout, isPending: isLogoutPending, isError: isLogoutError } =
    useLogoutAction()

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMobileMenuOpen])

  return (
    <SidebarPrimitive 
      className="sticky top-0 z-40 h-16 w-full shrink-0 px-4 md:h-screen md:w-60 md:px-6 md:py-8"
      >
      <SidebarHeader className="flex h-16 flex-row items-center justify-between p-0 text-center md:h-auto md:block md:p-2">
        <Link
          to="/"
          className="text-xl font-semibold text-white"
          onClick={() => {
            setIsMobileMenuOpen(false)
          }}
        >
          ConnectInno
        </Link>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white md:hidden"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={() => {
            setIsMobileMenuOpen((isOpen) => !isOpen)
          }}
        >
          {isMobileMenuOpen ? (<X aria-hidden="true" />) : (<Menu aria-hidden="true" />)}
        </button>
      </SidebarHeader>

      {isMobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-16 -z-10 bg-black/35 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => {
            setIsMobileMenuOpen(false)
          }}
        />
      ) : null}

      <SidebarContent
        id="mobile-navigation"
        className={`${isMobileMenuOpen ? 'flex' : 'hidden'} absolute left-0 top-16 h-auto w-full overflow-visible border-t border-white/15 bg-sidebar px-4 py-3 shadow-lg md:static md:mt-10 md:flex md:flex-1 md:border-0 md:p-0 md:shadow-none`}
      >
        <SidebarGroup className="p-0">
          <nav
            aria-label="Main navigation"
            onClick={() => {
              setIsMobileMenuOpen(false)
            }}
          >
            <SidebarMenu className="gap-1 md:flex-col md:gap-0">
              <SidebarMenuItem>
                {user ? (
                  <SidebarMenuButton asChild className={menuButtonClassName}>
                    <Link to="/profile/$profileId" params={{ profileId: user.uid }}>
                      <User className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                      <span>my profile</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    type="button"
                    className={menuButtonClassName}
                    disabled={isAuthLoading || !user}
                  >
                    <User className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                    <span>my profile</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={menuButtonClassName}>
                  <Link to="/messages">
                    <Mail
                      className="size-3.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <span>messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={menuButtonClassName}>
                  <Link to="/settings">
                    <Settings className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                    <span>settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  className={menuButtonClassName}
                  disabled={isLogoutPending}
                  onClick={() => void logout()}
                >
                  <LogOut className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                  <span>{isLogoutPending ? 'logging out…' : 'logout'}</span>
                </SidebarMenuButton>
                {isLogoutError ? (
                  <p role="alert" className="px-2 text-xs text-destructive">
                    Unable to log out. Please try again.
                  </p>
                ) : null}
              </SidebarMenuItem>
            </SidebarMenu>
          </nav>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  )
}