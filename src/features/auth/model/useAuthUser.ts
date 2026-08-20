import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth } from '@/shared/config/firebase'

export interface AuthUserState {
  user: User | null
  isLoading: boolean
}

export function useAuthUser(): AuthUserState {
  const [state, setState] = useState<AuthUserState>({
    user: firebaseAuth.currentUser,
    isLoading: true,
  })

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (user) => {
        setState({ user, isLoading: false })
      }),
    [],
  )

  return state
}