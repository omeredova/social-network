import type { Timestamp } from 'firebase/firestore'

export interface RepostedProfile {
  readonly id: string
  readonly name: string
  readonly username: string
  readonly description: string
  readonly photoUrl: string
}

export interface PostDocument {
  readonly authorId: string
  readonly content: string
  readonly imageUrl: string
  readonly createdAt: Timestamp
  readonly commentsCount: number
  readonly likesCount: number
  readonly repostsCount: number
  readonly originalPostId?: string
  readonly originalAuthorId?: string
  readonly repostedProfile?: RepostedProfile
}

export interface Post {
  readonly id: string
  readonly authorId: string
  readonly author: string
  readonly handle: string
  readonly avatarUrl?: string
  readonly avatarColor: string
  readonly publishedAt: string
  readonly text: string
  readonly imageUrl?: string
  readonly imageAlt?: string
  readonly likes: number
  readonly replies: number
  readonly comments: number
  readonly originalPostId?: string
  readonly originalAuthorId?: string
  readonly originalAuthor?: string
  readonly repostedProfile?: RepostedProfile
}

export interface Comment {
  readonly id: string
  readonly author: string
  readonly handle: string
  readonly avatarColor: string
  readonly publishedAt: string
  readonly text: string
  readonly likes: number
}

export type PostCounterField = keyof Pick<
  PostDocument,
  'likesCount' | 'commentsCount' | 'repostsCount'
>
