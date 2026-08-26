import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/entities/comment';
import { toggleCommentLike } from '../api/toggleCommentLike';

export function useToggleCommentLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commentKeys.all })
    },
  })
}