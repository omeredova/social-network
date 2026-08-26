import { useUserIdentity } from '@/entities/user';
import { useAuthSession } from './useAuthSession';

export interface AuthUser {
  readonly uid: string
  readonly email: string | null
  readonly displayName: string
  readonly photoURL: string
}

export interface AuthUserState {
  user: AuthUser | null
  isLoading: boolean
}

export function useAuthUser(): AuthUserState {
  const session = useAuthSession()
  const authState = {
    user: session.user,
    isLoading: session.isLoading,
  }
  const identityQuery = useUserIdentity(authState.user?.uid ?? null)
  const isLoading =
    authState.isLoading ||
    (authState.user !== null && identityQuery.isPending)

  if (!authState.user || isLoading) return { user: null, isLoading }

  const emailName = authState.user.email?.split('@')[0]

  return {
    user: {
      uid: authState.user.uid,
      email: authState.user.email,
      displayName:
        identityQuery.data?.name ??
        authState.user.displayName ??
        emailName ??
        'User',
      photoURL:
        identityQuery.data?.photoUrl ?? authState.user.photoURL ?? '',
    },
    isLoading: false,
  }
}