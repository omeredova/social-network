import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postKeys } from '@/entities/post'
import { userProfileKeys } from '@/entities/user'
import { repostPost } from '../api/repostPost'

export function useRepostPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: repostPost,
    onSuccess: async (_repostId, { postId, userId }) => {
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