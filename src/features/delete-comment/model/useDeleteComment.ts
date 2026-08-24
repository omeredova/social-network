import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/entities/comment';
import { postKeys } from '@/entities/post';
import { userProfileKeys } from '@/entities/user';
import { deleteComment } from '../api/deleteComment';

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async (_result, { postId, userId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) }),
        queryClient.invalidateQueries({
          queryKey: commentKeys.byAuthor(userId),
        }),
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
      ])
    },
  })
}