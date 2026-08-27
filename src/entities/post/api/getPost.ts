import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { Post } from '../model/types';
import { mapPostDocument } from './mapPostDocument';

export async function getPost(postId: string): Promise<Post | null> {
  const snapshot = await getDoc(doc(firestore, 'posts', postId))
  return snapshot.exists() ? mapPostDocument(snapshot) : null
}