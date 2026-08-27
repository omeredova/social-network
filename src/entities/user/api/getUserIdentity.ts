import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { UserIdentity } from '../model/types';

export async function getUserIdentity(
  profileId: string,
): Promise<UserIdentity | null> {
  const snapshot = await getDoc(doc(firestore, 'users', profileId))
  const profile = snapshot.data()

  if (!profile || typeof profile !== 'object') return null

  const { name, photoUrl } = profile
  if (typeof name !== 'string' || typeof photoUrl !== 'string') return null

  return { name, photoUrl }
}