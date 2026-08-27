import * as React from 'react';
import { cn } from '@/shared/lib/cn';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="empty" className={cn('flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center', className)} {...props} />
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="empty-header" className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)} {...props} />
}

function EmptyMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="empty-media" className={cn('mb-1 flex size-10 shrink-0 items-center justify-center rounded-lg bg-post-surface text-post-muted [&_svg]:size-5', className)} {...props} />
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="empty-title" className={cn('text-base font-medium text-post-foreground', className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="empty-description" className={cn('text-sm text-post-muted', className)} {...props} />
}

export { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }