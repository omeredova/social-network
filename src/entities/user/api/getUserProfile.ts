import type { EditableUserProfile, UserProfile } from '../model/types';
import { getUserProfileDocument } from './getUserProfileDocument';

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
  const snapshot = await getUserProfileDocument(profileId)
  if (!snapshot) return null

  const storedProfile = snapshot.data()

  if (!isEditableUserProfile(storedProfile)) return null

  const resolvedProfileId = snapshot.id
  return {
    id: resolvedProfileId,
    ...storedProfile,
    photoAlt: `Portrait of ${storedProfile.name}`,
  }
}