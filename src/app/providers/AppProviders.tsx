import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { configureMobX } from '@/app/providers/configureMobX';
import { queryClient } from '@/app/providers/queryClient';
import { router } from '@/app/router/router';
import { AuthSessionProvider } from '@/features/auth';

configureMobX()

export function AppProviders(){
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <RouterProvider router={router} context={{ queryClient }} />
      </AuthSessionProvider>
    </QueryClientProvider>
  )
}