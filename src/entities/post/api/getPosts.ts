import {
  collection,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import { INFINITE_PAGINATION } from '@/shared/config/infinitePagination';
import type { Post } from '../model/types';
import { mapPostDocument } from './mapPostDocument';

export interface PostsCursor {
  readonly createdAt: Timestamp
  readonly id: string
}

export interface PostsPage {
  readonly posts: readonly Post[]
  readonly nextCursor: PostsCursor | null
}

function getCreatedAt(value: unknown): Timestamp | null {
  if (!value || typeof value !== 'object') return null

  const createdAt: unknown = Reflect.get(value, 'createdAt')
  return createdAt instanceof Timestamp ? createdAt : null
}

export async function getPosts(cursor: PostsCursor | null): Promise<PostsPage> {
  const pageSize = cursor
    ? INFINITE_PAGINATION.nextPageSize
    : INFINITE_PAGINATION.initialPageSize
  const snapshot = await getDocs(
    query(
      collection(firestore, 'posts'),
      orderBy('createdAt', 'desc'),
      orderBy(documentId(), 'desc'),
      ...(cursor ? [startAfter(cursor.createdAt, cursor.id)] : []),
      limit(pageSize),
    ),
  )
  const posts = await Promise.all(snapshot.docs.map(mapPostDocument))
  const lastDocument = snapshot.docs.at(-1)
  const lastCreatedAt = getCreatedAt(lastDocument?.data())

  return {
    posts: posts.filter((post): post is Post => post !== null),
    nextCursor:
      snapshot.size === pageSize &&
      lastDocument &&
      lastCreatedAt instanceof Timestamp
        ? {
            createdAt: lastCreatedAt,
            id: lastDocument.id,
          }
        : null,
  }
}
