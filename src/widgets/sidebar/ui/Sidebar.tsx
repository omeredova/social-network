import { Link } from '@tanstack/react-router';
import { User, Mail, Settings, LogOut } from 'lucide-react';
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

const menuButtonClassName =
  'h-auto gap-1 rounded-none text-sm font-medium text-white transition-none hover:bg-sidebar'

export function Sidebar() {
  const { logout, isPending: isLogoutPending, isError: isLogoutError } =
    useLogoutAction()

  return (
    <SidebarPrimitive
      className="fixed w-full shrink-0 px-4 py-5 md:min-h-screen md:w-60 md:px-6 md:py-8"
    >
      <SidebarHeader className="text-center">
        <Link to="/" className="text-xl font-semibold text-white">
          Logo
        </Link>
      </SidebarHeader>

      <SidebarContent className="mt-5 overflow-visible md:mt-10">
        <SidebarGroup className="p-0">
          <nav aria-label="Main navigation">
            <SidebarMenu className="flex-row flex-wrap gap-0 md:flex-col">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={menuButtonClassName}>
                  <Link to="/profile/$profileId" params={{ profileId: 'maya-brooks' }}>
                    <User className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                    <span>my profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton type="button" className={menuButtonClassName}>
                  <Mail className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                  <span>messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton type="button" className={menuButtonClassName}>
                  <Settings className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                  <span>settings</span>
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