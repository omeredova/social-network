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
import {
  mapComment,
  parseStoredComment,
  parseStoredUser,
} from './mapCommentDocument';

const COMMENTS_PAGE_SIZE = 10

export interface CommentCursor {
  readonly createdAt: Timestamp
  readonly id: string
}

export interface CommentsPage {
  readonly comments: readonly Comment[]
  readonly nextCursor: CommentCursor | null
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
    const comment = parseStoredComment(commentSnapshot.data())
    return comment ? [{ id: commentSnapshot.id, comment }] : []
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
      parseStoredUser(authorSnapshots[index]?.data()),
    ]),
  )
  const comments = storedComments.map(({ id, comment }): Comment =>
    mapComment({
      id,
      comment,
      author: authors.get(comment.authorId),
    }),
  )
  const firstComment = storedComments.at(0)
  return {
    comments,
    nextCursor:
      snapshot.size === COMMENTS_PAGE_SIZE && firstComment
        ? { createdAt: firstComment.comment.createdAt, id: firstComment.id }
        : null,
  }
}