import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Comment } from '../model/types';
import {
  mapComment,
  parseStoredComment,
  parseStoredUser,
} from './mapCommentDocument';

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
  const author = parseStoredUser(userSnapshot.data())

  return commentsSnapshot.docs
    .flatMap((snapshot) => {
      const comment = parseStoredComment(snapshot.data())
      return comment ? [{ id: snapshot.id, comment }] : []
    })
    .sort(
      (left, right) =>
        right.comment.createdAt.toMillis() - left.comment.createdAt.toMillis(),
    )
    .map(({ id, comment }): Comment => mapComment({ id, comment, author }))
}