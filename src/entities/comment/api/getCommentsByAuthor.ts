import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Comment } from '../model/types';

interface StoredComment {
  readonly authorId: string
  readonly postId: string
  readonly content: string
  readonly createdAt: { readonly toDate: () => Date; readonly toMillis: () => number }
}

interface StoredUser {
  readonly name: string
  readonly username: string
  readonly photoUrl: string
}

interface TimestampLike {
  readonly toDate: () => Date
  readonly toMillis: () => number
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof value.toDate === 'function' &&
    'toMillis' in value &&
    typeof value.toMillis === 'function'
  )
}

function getStoredComment(value: unknown): StoredComment | null {
  if (!value || typeof value !== 'object') return null
  const comment = value as Record<string, unknown>
  const createdAt = comment.createdAt

  if (
    typeof comment.authorId !== 'string' ||
    typeof comment.postId !== 'string' ||
    typeof comment.content !== 'string' ||
    !isTimestampLike(createdAt)
  ) {
    return null
  }

  return {
    authorId: comment.authorId,
    postId: comment.postId,
    content: comment.content,
    createdAt,
  }
}

function getStoredUser(value: unknown): StoredUser | null {
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

function formatPublishedAt(date: Date): string {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1_000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes.toString()} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours.toString()} hr`
  const days = Math.floor(hours / 24)
  return `${days.toString()} day${days === 1 ? '' : 's'}`
}

export async function getCommentsByAuthor(
  authorId: string,
): Promise<readonly Comment[]> {
  const [commentsSnapshot, userSnapshot] = await Promise.all([
    getDocs(
      query(
        collection(firestore, 'comments'),
        where('authorId', '==', authorId),
      ),
    ),
    getDoc(doc(firestore, 'users', authorId)),
  ])
  const author = getStoredUser(userSnapshot.data())

  return commentsSnapshot.docs
    .flatMap((snapshot) => {
      const comment = getStoredComment(snapshot.data())
      return comment ? [{ id: snapshot.id, comment }] : []
    })
    .sort(
      (left, right) =>
        right.comment.createdAt.toMillis() - left.comment.createdAt.toMillis(),
    )
    .map(({ id, comment }): Comment => ({
      id,
      authorId: comment.authorId,
      postId: comment.postId,
      author: author?.name ?? 'Unknown user',
      handle: author?.username
        ? `@${author.username.replace(/^@/, '')}`
        : '@unknown',
      ...(author?.photoUrl ? { avatarUrl: author.photoUrl } : {}),
      publishedAt: formatPublishedAt(comment.createdAt.toDate()),
      text: comment.content,
    }))
}