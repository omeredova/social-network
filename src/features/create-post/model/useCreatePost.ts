import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { userProfileKeys } from '@/entities/user';
import { createPost } from '../api/createPost';

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (_postId, { authorId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: userProfileKeys.detail(authorId),
        }),
      ])
    },
  })
}