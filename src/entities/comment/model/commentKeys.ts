export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: string) => [...commentKeys.all, 'post', postId] as const,
}