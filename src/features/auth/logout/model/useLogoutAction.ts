import { useNavigate } from '@tanstack/react-router';
import { useLogout } from './useLogout';

interface UseLogoutActionResult {
  logout: () => Promise<void>;
  isPending: boolean;
  isError: boolean;
}

export function useLogoutAction(): UseLogoutActionResult {
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  async function logout(): Promise<void> {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      return
    }

    await navigate({ to: '/account/login' })
  }

  return {
    logout,
    isPending: logoutMutation.isPending,
    isError: logoutMutation.isError,
  }
}