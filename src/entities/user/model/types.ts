import type { Comment, Post } from '@/entities/post';

export interface UserProfile {
  readonly id: string
  readonly name: string
  readonly username: string
  readonly description: string
  readonly photoUrl: string
  readonly photoAlt: string
  readonly coverUrl: string
  readonly postsCount: number
  readonly posts: readonly Post[]
  readonly comments: readonly Comment[]
}