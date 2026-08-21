import { doc, increment, updateDoc } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { PostCounterField } from '@/entities/post';

export interface UpdatePostInput {
  readonly postId: string
  readonly field: PostCounterField
  readonly operation: 'increment' | 'decrement'
}

export async function updatePost(input: UpdatePostInput): Promise<void> {
  const amount = input.operation === 'increment' ? 1 : -1

  await updateDoc(doc(firestore, 'posts', input.postId), {
    [input.field]: increment(amount),
  })
}