import { useContext } from 'react';
import { AuthSessionContext } from './authSessionContext';
import type { AuthSessionStore } from './AuthSessionStore';

export function useAuthSession(): AuthSessionStore {
  const session = useContext(AuthSessionContext)

  if (!session) {
    throw new Error('useAuthSession must be used within AuthSessionProvider')
  }

  return session
}