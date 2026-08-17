export interface Post {
  readonly id: string
  readonly author: string
  readonly handle: string
  readonly avatarColor: string
  readonly avatarShape: 'circle' | 'square'
  readonly publishedAt: string
  readonly text: string
  readonly imageUrl?: string
  readonly imageAlt?: string
  readonly likes: number
  readonly replies: number
  readonly comments: number
}