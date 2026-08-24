import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/entities/comment';
import { postKeys } from '@/entities/post';
import { userProfileKeys } from '@/entities/user';
import { createComment } from '../api/createComment';

export function useCreateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createComment,
    onSuccess: async (_commentId, { postId, authorId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) }),
        queryClient.invalidateQueries({
          queryKey: commentKeys.byAuthor(authorId),
        }),
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
      ])
    },
  })
}