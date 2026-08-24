export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: string) => [...commentKeys.all, 'post', postId] as const,
  byAuthor: (authorId: string) =>
    [...commentKeys.all, 'author', authorId] as const,
}