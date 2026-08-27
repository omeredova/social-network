import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface PageContainerProps extends ComponentPropsWithoutRef<'main'> {
  readonly children: ReactNode
  readonly contentClassName?: string
}

function PageContainer({
  children,
  className,
  contentClassName,
  ...props
}: PageContainerProps) {
  return (
    <main
      className={cn('min-h-screen px-4 py-10 sm:px-6 sm:py-16', className)}
      {...props}
    >
      <div className={cn('mx-auto w-full max-w-2xl', contentClassName)}>
        {children}
      </div>
    </main>
  )
}

export { PageContainer, type PageContainerProps }