import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/shared/config/firebase'
import type { EditableUserProfile } from '@/entities/user'

export interface UpdateUserProfileInput {
  profileId: string
  profile: EditableUserProfile
}

export async function updateUserProfile({
  profileId,
  profile,
}: UpdateUserProfileInput): Promise<EditableUserProfile> {
  await setDoc(doc(firestore, 'users', profileId), profile, { merge: true })
  return profile
}