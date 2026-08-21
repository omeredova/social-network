import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/shared/config/firebase';

export interface RepostProfileInput {
  readonly profileId: string
  readonly userId: string
}

interface ProfileSnapshot {
  readonly name: string
  readonly username: string
  readonly description: string
  readonly photoUrl: string
}

function getProfileSnapshot(value: unknown): ProfileSnapshot | null {
  if (!value || typeof value !== 'object') return null
  const profile = value as Record<string, unknown>

  if (
    typeof profile.name !== 'string' ||
    typeof profile.username !== 'string' ||
    typeof profile.description !== 'string' ||
    typeof profile.photoUrl !== 'string'
  ) {
    return null
  }

  return {
    name: profile.name,
    username: profile.username,
    description: profile.description,
    photoUrl: profile.photoUrl,
  }
}

export async function repostProfile(input: RepostProfileInput): Promise<string> {
  if (firebaseAuth.currentUser?.uid !== input.userId) {
    throw new Error('You must be signed in to repost a profile.')
  }
  if (input.profileId === input.userId) {
    throw new Error('You cannot repost your own profile.')
  }

  const profileReference = doc(firestore, 'users', input.profileId)
  const repostId = `profile-repost-${input.userId}-${input.profileId}`
  const repostReference = doc(firestore, 'posts', repostId)

  await runTransaction(firestore, async (transaction) => {
    const [profileDocument, existingRepost] = await Promise.all([
      transaction.get(profileReference),
      transaction.get(repostReference),
    ])
    const profile = getProfileSnapshot(profileDocument.data())

    if (!profile) throw new Error('The profile is unavailable.')
    if (existingRepost.exists()) {
      throw new Error('You have already reposted this profile.')
    }

    transaction.set(repostReference, {
      authorId: input.userId,
      content: '',
      imageUrl: '',
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      repostedProfile: { id: input.profileId, ...profile },
    })
  })

  return repostId
}