import type { UserProfile } from './types'
import { commentsByPostId, postsMock } from '@/entities/post'

export const usersMock = [
  {
    id: 'maya-brooks',
    name: 'Maya Brooks',
    username: '@mayab',
    description:
      'Product designer, weekend photographer, and unapologetic coffee enthusiast. Sharing quiet moments and the ideas they spark.',
    photoUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85',
    photoAlt: 'Portrait of Maya Brooks',
    coverUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85',
    postsCount: 24,
    posts: [
      {
        id: 'morning-walk',
        author: 'Maya Brooks',
        handle: '@mayab',
        avatarColor: '#ef8354',
        publishedAt: '18 min',
        text: 'Slow mornings, good coffee, and nowhere urgent to be. A solid start to the weekend.',
        imageUrl:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85',
        imageAlt: 'A warm cup of coffee on a wooden table',
        likes: 128,
        replies: 12,
        comments: 9,
      },
      {
        id: 'golden-hour',
        author: 'Maya Brooks',
        handle: '@mayab',
        avatarColor: '#ef8354',
        publishedAt: '2 days',
        text: 'The best part of taking the long way home is catching the city when it turns gold.',
        imageUrl:
          'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=85',
        imageAlt: 'A city street in warm evening light',
        likes: 214,
        replies: 18,
        comments: 16,
      },
    ],
    comments: [
      {
        id: 'maya-comment-progress',
        author: 'Maya Brooks',
        handle: '@mayab',
        avatarColor: '#ef8354',
        publishedAt: '45 min',
        text: 'Shipping the first version is always the hardest part. This is such a good reminder.',
        likes: 12,
      },
      {
        id: 'maya-comment-walk',
        author: 'Maya Brooks',
        handle: '@mayab',
        avatarColor: '#ef8354',
        publishedAt: '1 day',
        text: 'Adding this place to my Sunday walk list — it looks wonderfully peaceful.',
        likes: 8,
      },
    ],
  },
] satisfies readonly UserProfile[]

export function getUserProfileById(profileId: string): UserProfile | undefined {
  const storedProfile = usersMock.find(
    (user) => user.id === profileId || user.username.slice(1) === profileId,
  )

  if (storedProfile) return storedProfile

  const allComments = Object.values(commentsByPostId).flat()
  const authoredPost = postsMock.find((post) => post.handle.slice(1) === profileId)
  const authoredComment = allComments.find((comment) => comment.handle.slice(1) === profileId)
  const author = authoredPost ?? authoredComment

  if (!author) return undefined

  const posts = postsMock.filter((post) => post.handle === author.handle)
  const comments = allComments.filter((comment) => comment.handle === author.handle)

  return {
    id: profileId,
    name: author.author,
    username: author.handle,
    description: `See the latest posts and comments shared by ${author.author}.`,
    photoUrl: `https://i.pravatar.cc/400?u=${profileId}`,
    photoAlt: `Portrait of ${author.author}`,
    coverUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85',
    postsCount: posts.length,
    posts,
    comments,
  }
}