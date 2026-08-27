import { doc, getDoc, type DocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Post, PostDocument, RepostedProfile } from '../model/types';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';

interface UserDocument {
  readonly name: string
  readonly username: string
  readonly photoUrl: string
}

function isPostDocument(value: unknown): value is PostDocument {
  if (!value || typeof value !== 'object') return false
  const post = value as Record<string, unknown>

  return (
    typeof post.authorId === 'string' &&
    typeof post.content === 'string' &&
    typeof post.imageUrl === 'string' &&
    (post.location === undefined || typeof post.location === 'string') &&
    typeof post.createdAt === 'object' &&
    post.createdAt !== null &&
    'toDate' in post.createdAt &&
    typeof post.commentsCount === 'number' &&
    typeof post.likesCount === 'number' &&
    typeof post.repostsCount === 'number' &&
    (post.originalPostId === undefined ||
      typeof post.originalPostId === 'string') &&
    (post.originalAuthorId === undefined ||
      typeof post.originalAuthorId === 'string') &&
    (post.repostedProfile === undefined ||
      isRepostedProfile(post.repostedProfile))
  )
}

function isRepostedProfile(value: unknown): value is RepostedProfile {
  if (!value || typeof value !== 'object') return false
  const profile = value as Record<string, unknown>

  return (
    typeof profile.id === 'string' &&
    typeof profile.name === 'string' &&
    typeof profile.username === 'string' &&
    typeof profile.description === 'string' &&
    typeof profile.photoUrl === 'string'
  )
}

function getUserDocument(value: unknown): UserDocument | null {
  if (!value || typeof value !== 'object') return null
  const user = value as Record<string, unknown>

  if (
    typeof user.name !== 'string' ||
    typeof user.username !== 'string' ||
    typeof user.photoUrl !== 'string'
  ) {
    return null
  }

  return { name: user.name, username: user.username, photoUrl: user.photoUrl }
}

export async function mapPostDocument(
  snapshot: DocumentSnapshot,
): Promise<Post | null> {
  const storedPost = snapshot.data()
  if (!isPostDocument(storedPost)) return null

  const [userSnapshot, originalAuthorSnapshot] = await Promise.all([
    getDoc(doc(firestore, 'users', storedPost.authorId)),
    storedPost.originalAuthorId
      ? getDoc(doc(firestore, 'users', storedPost.originalAuthorId))
      : Promise.resolve(null),
  ])
  const author = getUserDocument(userSnapshot.data())
  const originalAuthor = getUserDocument(originalAuthorSnapshot?.data())

  return {
    id: snapshot.id,
    authorId: storedPost.authorId,
    author: author?.name ?? 'Unknown user',
    handle: author?.username
      ? `@${author.username.replace(/^@/, '')}`
      : '@unknown',
    ...(author && author.photoUrl.length > 0
      ? { avatarUrl: author.photoUrl }
      : {}),
    publishedAt: formatRelativeTime(storedPost.createdAt.toDate()),
    text: storedPost.content,
    ...(storedPost.imageUrl
      ? { imageUrl: storedPost.imageUrl, imageAlt: 'Post attachment' }
      : {}),
    ...(storedPost.location ? { location: storedPost.location } : {}),
    likes: storedPost.likesCount,
    likeAuthor: Array.isArray(storedPost.likeAuthor)
      ? [
          ...new Set(
            storedPost.likeAuthor.filter(
              (userId): userId is string => typeof userId === 'string',
            ),
          ),
        ]
      : [],
    replies: storedPost.repostsCount,
    comments: storedPost.commentsCount,
    ...(storedPost.originalPostId
      ? { originalPostId: storedPost.originalPostId }
      : {}),
    ...(storedPost.originalAuthorId
      ? {
          originalAuthorId: storedPost.originalAuthorId,
          originalAuthor: originalAuthor?.name ?? 'Unknown user',
        }
      : {}),
    ...(storedPost.repostedProfile
      ? { repostedProfile: storedPost.repostedProfile }
      : {}),
  }
}
