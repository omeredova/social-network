export interface Post {
  readonly id: string
  readonly author: string
  readonly handle: string
  readonly avatarColor: string
  readonly publishedAt: string
  readonly text: string
  readonly imageUrl?: string
  readonly imageAlt?: string
  readonly likes: number
  readonly replies: number
  readonly comments: number
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