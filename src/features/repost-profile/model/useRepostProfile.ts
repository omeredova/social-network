import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { userProfileKeys } from '@/entities/user';
import { repostProfile } from '../api/repostProfile';

export function useRepostProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: repostProfile,
    onSuccess: async (_repostId, { userId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: userProfileKeys.detail(userId),
        }),
      ])
    },
  })
}