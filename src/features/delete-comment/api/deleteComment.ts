import { doc, runTransaction } from 'firebase/firestore'
import { firebaseAuth, firestore } from '@/shared/config/firebase'

export interface DeleteCommentInput {
  readonly commentId: string
  readonly postId: string
  readonly userId: string
}

function getAuthorId(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const authorId = (value as Record<string, unknown>).authorId
  return typeof authorId === 'string' ? authorId : null
}

function getCommentsCount(value: unknown): number | null {
  if (!value || typeof value !== 'object') return null
  const commentsCount = (value as Record<string, unknown>).commentsCount
  return typeof commentsCount === 'number' ? commentsCount : null
}

export async function deleteComment(input: DeleteCommentInput): Promise<void> {
  if (firebaseAuth.currentUser?.uid !== input.userId) {
    throw new Error('You must be signed in to delete a comment.')
  }

  const commentReference = doc(firestore, 'comments', input.commentId)
  const postReference = doc(firestore, 'posts', input.postId)

  await runTransaction(firestore, async (transaction) => {
    const [commentSnapshot, postSnapshot] = await Promise.all([
      transaction.get(commentReference),
      transaction.get(postReference),
    ])
    const authorId = getAuthorId(commentSnapshot.data())

    if (!authorId) throw new Error('The comment is unavailable.')
    if (authorId !== input.userId) {
      throw new Error('You can only delete your own comments.')
    }

    transaction.delete(commentReference)

    if (postSnapshot.exists()) {
      const commentsCount = getCommentsCount(postSnapshot.data())
      if (commentsCount !== null) {
        transaction.update(postReference, {
          commentsCount: Math.max(0, commentsCount - 1),
        })
      }
    }
  })
}