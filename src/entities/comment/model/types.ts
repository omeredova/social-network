export interface Comment {
  readonly id: string
  readonly authorId: string
  readonly postId: string
  readonly author: string
  readonly handle: string
  readonly avatarUrl?: string
  readonly publishedAt: string
  readonly text: string
  readonly likesCount: number
  readonly likeAuthor: readonly string[]
}