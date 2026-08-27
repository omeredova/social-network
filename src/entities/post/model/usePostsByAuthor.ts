import { useQuery } from '@tanstack/react-query';
import { getPostsByAuthor } from '../api/getPostsByAuthor';
import { postKeys } from './postKeys';

export function usePostsByAuthor(authorId: string | null) {
  return useQuery({
    queryKey: postKeys.byAuthor(authorId ?? ''),
    queryFn: () => (authorId ? getPostsByAuthor(authorId) : []),
    enabled: authorId !== null,
    staleTime: 30_000,
  })
}