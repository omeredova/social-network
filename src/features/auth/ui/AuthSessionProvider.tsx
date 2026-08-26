import { useEffect, useState, type ReactNode } from 'react';
import { firebaseAuth } from '@/shared/config/firebase';
import { AuthSessionStore } from '../model/AuthSessionStore';
import { AuthSessionContext } from '../model/authSessionContext';

interface AuthSessionProviderProps {
  readonly children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const [session] = useState(() => new AuthSessionStore(firebaseAuth))

  useEffect(() => {
    session.start()
    return () => {
      session.stop()
    }
  }, [session])

  return (
    <AuthSessionContext.Provider value={session}>
      {children}
    </AuthSessionContext.Provider>
  )
}