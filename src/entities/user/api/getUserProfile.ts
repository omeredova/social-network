import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import { getPostsByAuthor } from '@/entities/post';
import type { EditableUserProfile, UserProfile } from '../model/types';

function isEditableUserProfile(value: unknown): value is EditableUserProfile {
  if (!value || typeof value !== 'object') return false

  const profile = value as Record<string, unknown>

  return (
    typeof profile.name === 'string' &&
    typeof profile.coverUrl === 'string' &&
    typeof profile.photoUrl === 'string' &&
    typeof profile.username === 'string' &&
    typeof profile.description === 'string'
  )
}

export async function getUserProfile(
  profileId: string,
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(firestore, 'users', profileId))
  const storedProfile = snapshot.data()

  if (!isEditableUserProfile(storedProfile)) return null

  const posts = await getPostsByAuthor(profileId)

  return {
    id: profileId,
    ...storedProfile,
    photoAlt: `Portrait of ${storedProfile.name}`,
    postsCount: posts.length,
    posts,
    comments: [],
  }
}