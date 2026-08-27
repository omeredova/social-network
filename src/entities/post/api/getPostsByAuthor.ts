import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Post } from '../model/types';
import { mapPostDocument } from './mapPostDocument';

interface TimestampLike {
  toMillis(): number
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toMillis' in value &&
    typeof value.toMillis === 'function'
  )
}

function getCreatedAtMilliseconds(value: unknown): number {
  if (!value || typeof value !== 'object') return 0

  const document = value as Record<string, unknown>
  const createdAt = document.createdAt

  if (!isTimestampLike(createdAt)) return 0

  return createdAt.toMillis()
}

export async function getPostsByAuthor(
  authorId: string,
): Promise<readonly Post[]> {
  const snapshot = await getDocs(
    query(collection(firestore, 'posts'), where('authorId', '==', authorId)),
  )
  const documents = [...snapshot.docs].sort(
    (left, right) =>
      getCreatedAtMilliseconds(right.data()) -
      getCreatedAtMilliseconds(left.data()),
  )
  const posts = await Promise.all(documents.map(mapPostDocument))

  return posts.filter((post): post is Post => post !== null)
}