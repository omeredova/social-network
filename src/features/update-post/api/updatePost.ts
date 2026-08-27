import { doc, increment, runTransaction, updateDoc } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { PostCounterField } from '@/entities/post';

export interface UpdatePostInput {
  readonly postId: string
  readonly field: PostCounterField
  readonly operation: 'increment' | 'decrement'
  readonly userId?: string
}

export async function updatePost(input: UpdatePostInput): Promise<void> {
  if (input.field === 'likesCount') {
    if (!input.userId) throw new Error('You must be signed in to like a post.')
    await updatePostLike(input.postId, input.userId, input.operation)
    return
  }

  const amount = input.operation === 'increment' ? 1 : -1

  await updateDoc(doc(firestore, 'posts', input.postId), {
    [input.field]: increment(amount),
  })
}

async function updatePostLike(
  postId: string,
  userId: string,
  operation: 'increment' | 'decrement',
): Promise<void> {
  const postReference = doc(firestore, 'posts', postId)

  await runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(postReference)
    if (!snapshot.exists()) throw new Error('Post no longer exists.')

    const data: unknown = snapshot.data()
    const storedLikeAuthor =
      data && typeof data === 'object'
        ? (data as Record<string, unknown>).likeAuthor
        : undefined
    const likeAuthor = Array.isArray(storedLikeAuthor)
      ? [
          ...new Set(
            storedLikeAuthor.filter(
              (storedUserId): storedUserId is string =>
                typeof storedUserId === 'string',
            ),
          ),
        ]
      : []
    const alreadyLiked = likeAuthor.includes(userId)
    const shouldLike = operation === 'increment'
    const nextLikeAuthor = shouldLike
      ? alreadyLiked
        ? likeAuthor
        : [...likeAuthor, userId]
      : likeAuthor.filter((storedUserId) => storedUserId !== userId)

    transaction.update(postReference, {
      likeAuthor: nextLikeAuthor,
      likesCount: nextLikeAuthor.length,
    })
  })
}