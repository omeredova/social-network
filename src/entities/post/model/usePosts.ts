import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts, type PostsCursor } from '../api/getPosts';
import { postKeys } from './postKeys';

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: ({ pageParam }) => getPosts(pageParam),
    initialPageParam: null as PostsCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}