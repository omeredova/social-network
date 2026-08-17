import { createFileRoute } from '@tanstack/react-router';
import { PostRoute } from '@/pages/post';

export const Route = createFileRoute('/posts/$postId')({
  component: PostRoute,
})