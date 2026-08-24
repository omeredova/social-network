import { useInfiniteQuery } from '@tanstack/react-query';
import { type CommentCursor, getPostComments } from '../api/getPostComments';
import { commentKeys } from './commentKeys';

export function usePostComments(postId: string) {
  return useInfiniteQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: ({ pageParam }) => getPostComments(postId, pageParam),
    initialPageParam: null as CommentCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
  })
}