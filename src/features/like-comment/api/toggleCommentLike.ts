import { doc, runTransaction } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';

export interface ToggleCommentLikeInput {
  readonly commentId: string
  readonly operation: 'increment' | 'decrement'
  readonly userId: string
}

export async function toggleCommentLike({
  commentId,
  operation,
  userId,
}: ToggleCommentLikeInput): Promise<void> {
  const commentReference = doc(firestore, 'comments', commentId)

  await runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(commentReference)
    if (!snapshot.exists()) throw new Error('Comment no longer exists.')

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

    transaction.update(commentReference, {
      likeAuthor: nextLikeAuthor,
      likesCount: nextLikeAuthor.length,
    })
  })
}
