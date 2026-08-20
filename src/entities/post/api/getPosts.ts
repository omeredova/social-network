import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Post } from '../model/types';
import { mapPostDocument } from './mapPostDocument';

export async function getPosts(): Promise<readonly Post[]> {
  const snapshot = await getDocs(
    query(collection(firestore, 'posts'), orderBy('createdAt', 'desc')),
  )
  const posts = await Promise.all(snapshot.docs.map(mapPostDocument))
  return posts.filter((post): post is Post => post !== null)
}