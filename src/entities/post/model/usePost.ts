import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api/getPost';
import { postKeys } from './postKeys';

export function usePost(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
  })
}