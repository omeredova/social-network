import { Timestamp } from 'firebase/firestore';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import type { Comment } from '../model/types';

export interface StoredComment {
  readonly authorId: string
  readonly postId: string
  readonly content: string
  readonly createdAt: Timestamp
}

export interface StoredUser {
  readonly name: string
  readonly username: string
  readonly photoUrl: string
}

export function parseStoredComment(value: unknown): StoredComment | null {
  if (!value || typeof value !== 'object') return null

  const comment = value as Record<string, unknown>
  if (
    typeof comment.authorId !== 'string' ||
    typeof comment.postId !== 'string' ||
    typeof comment.content !== 'string' ||
    !(comment.createdAt instanceof Timestamp)
  ) {
    return null
  }

  return {
    authorId: comment.authorId,
    postId: comment.postId,
    content: comment.content,
    createdAt: comment.createdAt,
  }
}

export function parseStoredUser(value: unknown): StoredUser | null {
  if (!value || typeof value !== 'object') return null

  const user = value as Record<string, unknown>
  if (
    typeof user.name !== 'string' ||
    typeof user.username !== 'string' ||
    typeof user.photoUrl !== 'string'
  ) {
    return null
  }

  return {
    name: user.name,
    username: user.username,
    photoUrl: user.photoUrl,
  }
}

interface MapCommentInput {
  readonly id: string
  readonly comment: StoredComment
  readonly author: StoredUser | null | undefined
}

export function mapComment({ id, comment, author }: MapCommentInput): Comment {
  return {
    id,
    authorId: comment.authorId,
    postId: comment.postId,
    author: author?.name ?? 'Unknown user',
    handle: author?.username ? normalizeHandle(author.username) : '@unknown',
    ...(author?.photoUrl ? { avatarUrl: author.photoUrl } : {}),
    publishedAt: formatRelativeTime(comment.createdAt.toDate()),
    text: comment.content,
  }
}

function normalizeHandle(username: string): string {
  return `@${username.replace(/^@/, '')}`
}