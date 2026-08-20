import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api/logoutUser';

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}