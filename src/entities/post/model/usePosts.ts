import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/getPosts';
import { postKeys } from './postKeys';

export function usePosts() {
  return useQuery({ queryKey: postKeys.lists(), queryFn: getPosts })
}