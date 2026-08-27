import type { ReactNode } from 'react';

interface AuthPageLayoutProps {
  children: ReactNode
  footer: ReactNode
}

export function AuthPageLayout({ children, footer }: AuthPageLayoutProps) {
  return (
    <main className="isolate grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="flex flex-col">
        {children}
        <div className="mt-3 text-center opacity-75">{footer}</div>
      </div>
    </main>
  )
}