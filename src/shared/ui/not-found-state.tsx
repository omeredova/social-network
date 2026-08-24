import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface NotFoundStateProps extends ComponentPropsWithoutRef<'main'> {
  readonly title: string
  readonly action?: ReactNode
  readonly description?: ReactNode
}

function NotFoundState({
  action,
  className,
  description,
  title,
  ...props
}: NotFoundStateProps) {
  return (
    <main
      className={cn('grid min-h-screen place-items-center px-4', className)}
      {...props}
    >
      <div className="text-center">
        <h1 className="font-serif text-4xl text-post-foreground">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-post-muted">{description}</p>
        ) : null}
        {action}
      </div>
    </main>
  )
}

export { NotFoundState, type NotFoundStateProps }