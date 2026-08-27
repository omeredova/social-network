import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { userProfileKeys } from '@/entities/user';
import { deletePost } from '../api/deletePost';

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (originalPostId, { postId, userId }) => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: userProfileKeys.detail(userId),
        }),
      ]

      if (originalPostId) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: postKeys.detail(originalPostId),
          }),
        )
      }

      await Promise.all(invalidations)
    },
  })
}