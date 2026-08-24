import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/lib/cn';

type StatusMessageTone = 'muted' | 'destructive'

interface StatusMessageProps extends ComponentPropsWithoutRef<'p'> {
  readonly tone?: StatusMessageTone
}

function StatusMessage({
  className,
  role,
  tone = 'muted',
  ...props
}: StatusMessageProps) {
  return (
    <p
      role={role ?? (tone === 'destructive' ? 'alert' : 'status')}
      className={cn(
        'text-sm',
        tone === 'destructive' ? 'text-destructive' : 'text-post-muted',
        className,
      )}
      {...props}
    />
  )
}

export { StatusMessage, type StatusMessageProps, type StatusMessageTone }