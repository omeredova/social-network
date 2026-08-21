import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { userProfileKeys } from '@/entities/user';
import { deletePost } from '../api/deletePost';

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (_result, { postId, userId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: userProfileKeys.detail(userId),
        }),
      ])
    },
  })
}