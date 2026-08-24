import { useQuery } from '@tanstack/react-query';
import { getCommentsByAuthor } from '../api/getCommentsByAuthor';
import { commentKeys } from './commentKeys';

export function useCommentsByAuthor(authorId: string, enabled: boolean) {
  return useQuery({
    queryKey: commentKeys.byAuthor(authorId),
    queryFn: () => getCommentsByAuthor(authorId),
    enabled,
    staleTime: 30_000,
  })
}