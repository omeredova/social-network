import { LoaderCircle, WifiOff } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import type { EchoConnectionStatus } from '../api/echoWebSocketClient';

interface ConnectionNotificationProps {
  readonly status: EchoConnectionStatus
}

export function ConnectionNotification({
  status,
}: ConnectionNotificationProps) {
  if (status === 'connected') return null

  const hasError = status === 'error'

  return (
    <Card
      className="fixed top-3 right-3 left-3 z-50 flex items-center gap-3 rounded-lg border-post-border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:left-auto sm:w-80"
      role={hasError ? 'alert' : 'status'}
      aria-live={hasError ? 'assertive' : 'polite'}
    >
      {hasError ? (
        <WifiOff className="size-4 shrink-0 text-destructive" aria-hidden="true" />
      ) : (
        <LoaderCircle
          className="size-4 shrink-0 animate-spin text-profile-accent"
          aria-hidden="true"
        />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-post-foreground">
          {hasError ? 'Connection interrupted' : 'Connecting to chat'}
        </p>
        <p className="text-xs text-post-muted">
          {hasError
            ? 'Trying to reconnect…'
            : 'Messages will be available in a moment.'}
        </p>
      </div>
    </Card>
  )
}