export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  detail: (postId: string) => [...postKeys.all, 'detail', postId] as const,
}