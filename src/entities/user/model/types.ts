import type { Post } from '@/entities/post';

export interface UserIdentity {
  readonly name: string
  readonly photoUrl: string
}

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
}

export type EditableUserProfile = Pick<
  UserProfile,
  'name' | 'coverUrl' | 'photoUrl' | 'username' | 'description'
>