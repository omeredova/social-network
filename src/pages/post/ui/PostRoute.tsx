import { useParams } from '@tanstack/react-router';
import { PostPage } from './PostPage';

export function PostRoute() {
  const { postId } = useParams({ from: '/posts/$postId' })
  return <PostPage postId={postId} />
}