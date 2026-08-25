import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { firestore } from '@/shared/config/firebase'

export async function getUserProfileDocument(
  profileIdOrUsername: string,
): Promise<DocumentSnapshot | null> {
  const profileSnapshot = await getDoc(doc(firestore, 'users', profileIdOrUsername))

  if (profileSnapshot.exists()) return profileSnapshot

  const normalizedUsername = profileIdOrUsername.replace(/^@/, '')
  const usernameSnapshot = await getDocs(
    query(
      collection(firestore, 'users'),
      where('username', 'in', [normalizedUsername, `@${normalizedUsername}`]),
      limit(1),
    ),
  )

  return usernameSnapshot.docs[0] ?? null
}
