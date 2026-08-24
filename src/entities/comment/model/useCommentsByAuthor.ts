import { useInfiniteQuery } from '@tanstack/react-query';
import {
  type AuthorCommentsCursor,
  getCommentsByAuthor,
} from '../api/getCommentsByAuthor';
import { commentKeys } from './commentKeys';

export function useCommentsByAuthor(authorId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: commentKeys.byAuthor(authorId),
    queryFn: ({ pageParam }) => getCommentsByAuthor(authorId, pageParam),
    initialPageParam: null as AuthorCommentsCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    staleTime: 30_000,
  })
}