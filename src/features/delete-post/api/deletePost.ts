import { doc, increment, runTransaction } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/shared/config/firebase';

export interface DeletePostInput {
  readonly postId: string
  readonly userId: string
}

interface DeletablePost {
  readonly authorId: string
  readonly originalPostId?: string
}

function getDeletablePost(value: unknown): DeletablePost | null {
  if (!value || typeof value !== 'object') return null
  const post = value as Record<string, unknown>

  if (
    typeof post.authorId !== 'string' ||
    (post.originalPostId !== undefined &&
      typeof post.originalPostId !== 'string')
  ) {
    return null
  }

  return {
    authorId: post.authorId,
    ...(typeof post.originalPostId === 'string'
      ? { originalPostId: post.originalPostId }
      : {}),
  }
}

export async function deletePost(
  input: DeletePostInput,
): Promise<string | null> {
  if (firebaseAuth.currentUser?.uid !== input.userId) {
    throw new Error('You must be signed in to delete a post.')
  }

  const postReference = doc(firestore, 'posts', input.postId)

  return runTransaction(firestore, async (transaction) => {
    const postSnapshot = await transaction.get(postReference)
    const post = getDeletablePost(postSnapshot.data())

    if (!post) throw new Error('The post is unavailable.')
    if (post.authorId !== input.userId) {
      throw new Error('You can only delete your own posts.')
    }

    if (post.originalPostId) {
      const originalReference = doc(firestore, 'posts', post.originalPostId)
      const originalSnapshot = await transaction.get(originalReference)

      if (originalSnapshot.exists()) {
        transaction.update(originalReference, { repostsCount: increment(-1) })
      }
    }

    transaction.delete(postReference)
    return post.originalPostId ?? null
  })
}