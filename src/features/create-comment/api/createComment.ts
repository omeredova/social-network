import {
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';

export interface CreateCommentInput {
  readonly authorId: string
  readonly postId: string
  readonly content: string
}

export async function createComment(
  input: CreateCommentInput,
): Promise<string> {
  const content = input.content.trim()
  if (!content) throw new Error('Comment cannot be empty.')

  const commentReference = doc(collection(firestore, 'comments'))
  const postReference = doc(firestore, 'posts', input.postId)
  const batch = writeBatch(firestore)

  batch.set(commentReference, {
    authorId: input.authorId,
    postId: input.postId,
    content,
    createdAt: serverTimestamp(),
  })
  batch.update(postReference, { commentsCount: increment(1) })
  await batch.commit()

  return commentReference.id
}