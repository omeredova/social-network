import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postKeys } from '@/entities/post'
import { userProfileKeys } from '@/entities/user'
import { updatePost } from '../api/updatePost'

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePost,
    onSuccess: async (_result, { postId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
        queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
      ])
    },
  })
}