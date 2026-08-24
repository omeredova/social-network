import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useUserIdentity } from '@/entities/user';
import { firebaseAuth } from '@/shared/config/firebase';

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
  const [authState, setAuthState] = useState<{
    user: User | null
    isLoading: boolean
  }>({
    user: firebaseAuth.currentUser,
    isLoading: true,
  })
  const identityQuery = useUserIdentity(authState.user?.uid ?? null)

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (user) => {
        setAuthState({ user, isLoading: false })
      }),
    [],
  )

  const isIdentityLoading = authState.user !== null && identityQuery.isPending
  const isLoading = authState.isLoading || isIdentityLoading

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