import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import { INFINITE_PAGINATION } from '@/shared/config/infinitePagination';
import { getFirebaseErrorCode } from '@/shared/lib/firebase/getFirebaseErrorCode';
import type { Comment } from '../model/types';
import {
  mapComment,
  parseStoredComment,
  parseStoredUser,
} from './mapCommentDocument';

interface FirestoreAuthorCommentsCursor {
  readonly kind: 'firestore'
  readonly createdAt: Timestamp
  readonly id: string
}

interface FallbackAuthorCommentsCursor {
  readonly kind: 'fallback'
  readonly offset: number
}

export type AuthorCommentsCursor =
  FirestoreAuthorCommentsCursor | FallbackAuthorCommentsCursor

export interface AuthorCommentsPage {
  readonly comments: readonly Comment[]
  readonly nextCursor: AuthorCommentsCursor | null
}

export async function getCommentsByAuthor(
  authorId: string,
  cursor: AuthorCommentsCursor | null,
): Promise<AuthorCommentsPage> {
  const pageSize = cursor
    ? INFINITE_PAGINATION.nextPageSize
    : INFINITE_PAGINATION.initialPageSize
  const userSnapshot = await getDoc(doc(firestore, 'users', authorId))
  const author = parseStoredUser(userSnapshot.data())

  if (cursor?.kind === 'fallback') {
    return getFallbackPage(authorId, cursor.offset, pageSize, author)
  }

  try {
    const commentsSnapshot = await getDocs(
      query(
        collection(firestore, 'comments'),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc'),
        orderBy(documentId(), 'desc'),
        ...(cursor ? [startAfter(cursor.createdAt, cursor.id)] : []),
        limit(pageSize),
      ),
    )
    const storedComments = commentsSnapshot.docs.flatMap((snapshot) => {
      const comment = parseStoredComment(snapshot.data())
      return comment ? [{ id: snapshot.id, comment }] : []
    })
    const lastComment = storedComments.at(-1)

    return {
      comments: storedComments.map(({ id, comment }): Comment =>
        mapComment({ id, comment, author }),
      ),
      nextCursor:
        commentsSnapshot.size === pageSize && lastComment
          ? {
              kind: 'firestore',
              createdAt: lastComment.comment.createdAt,
              id: lastComment.id,
            }
          : null,
    }
  } catch (error: unknown) {
    if (!isMissingIndexError(error)) throw error

    return getFallbackPage(authorId, 0, pageSize, author)
  }
}

function isMissingIndexError(error: unknown): boolean {
  const code = getFirebaseErrorCode(error)
  return (
    code === 'failed-precondition' || code === 'firestore/failed-precondition'
  )
}

async function getFallbackPage(
  authorId: string,
  offset: number,
  pageSize: number,
  author: ReturnType<typeof parseStoredUser>,
): Promise<AuthorCommentsPage> {
  const commentsSnapshot = await getDocs(
    query(collection(firestore, 'comments'), where('authorId', '==', authorId)),
  )
  const storedComments = commentsSnapshot.docs.flatMap((snapshot) => {
    const comment = parseStoredComment(snapshot.data())
    return comment ? [{ id: snapshot.id, comment }] : []
  })
  storedComments.sort((left, right) => {
    const dateDifference =
      right.comment.createdAt.toMillis() - left.comment.createdAt.toMillis()
    return dateDifference || right.id.localeCompare(left.id)
  })
  const page = storedComments.slice(offset, offset + pageSize)
  const nextOffset = offset + page.length

  return {
    comments: page.map(({ id, comment }): Comment =>
      mapComment({ id, comment, author }),
    ),
    nextCursor:
      nextOffset < storedComments.length
        ? { kind: 'fallback', offset: nextOffset }
        : null,
  }
}
