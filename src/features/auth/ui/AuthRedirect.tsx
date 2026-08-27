import { useEffect } from 'react';
import { StatusMessage } from '@/shared/ui/status-message';

export function AuthRedirect() {
  useEffect(() => {
    window.location.replace('/account/login')
  }, [])

  return <StatusMessage>Redirecting to login...</StatusMessage>
}