import {
  collection,
  doc,
  documentId,
  endBefore,
  getDoc,
  getDocs,
  limitToLast,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Comment } from '../model/types';

const COMMENTS_PAGE_SIZE = 3

interface StoredComment {
  readonly authorId: string
  readonly postId: string
  readonly content: string
  readonly createdAt: Timestamp
}

interface StoredUser {
  readonly name: string
  readonly username: string
  readonly photoUrl: string
}

export interface CommentCursor {
  readonly createdAt: Timestamp
  readonly id: string
}

export interface CommentsPage {
  readonly comments: readonly Comment[]
  readonly nextCursor: CommentCursor | null
}

function isStoredComment(value: unknown): value is StoredComment {
  if (!value || typeof value !== 'object') return false
  const comment = value as Record<string, unknown>
  return (
    typeof comment.authorId === 'string' &&
    typeof comment.postId === 'string' &&
    typeof comment.content === 'string' &&
    comment.createdAt instanceof Timestamp
  )
}

function getStoredUser(value: unknown): StoredUser | null {
  if (!value || typeof value !== 'object') return null
  const user = value as Record<string, unknown>
  if (
    typeof user.name !== 'string' ||
    typeof user.username !== 'string' ||
    typeof user.photoUrl !== 'string'
  )
    return null
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

export async function getPostComments(
  postId: string,
  cursor: CommentCursor | null,
): Promise<CommentsPage> {
  const snapshot = await getDocs(
    query(
      collection(firestore, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt'),
      orderBy(documentId()),
      ...(cursor ? [endBefore(cursor.createdAt, cursor.id)] : []),
      limitToLast(COMMENTS_PAGE_SIZE),
    ),
  )
  const storedComments = snapshot.docs.flatMap((commentSnapshot) => {
    const comment = commentSnapshot.data()
    return isStoredComment(comment) ? [{ id: commentSnapshot.id, comment }] : []
  })
  const authorIds = [
    ...new Set(storedComments.map(({ comment }) => comment.authorId)),
  ]
  const authorSnapshots = await Promise.all(
    authorIds.map((authorId) => getDoc(doc(firestore, 'users', authorId))),
  )
  const authors = new Map(
    authorIds.map((authorId, index) => [
      authorId,
      getStoredUser(authorSnapshots[index]?.data()),
    ]),
  )
  const comments = storedComments.map(({ id, comment }): Comment => {
    const author = authors.get(comment.authorId)
    return {
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
    }
  })
  const firstComment = storedComments.at(0)
  return {
    comments,
    nextCursor:
      snapshot.size === COMMENTS_PAGE_SIZE && firstComment
        ? { createdAt: firstComment.comment.createdAt, id: firstComment.id }
        : null,
  }
}