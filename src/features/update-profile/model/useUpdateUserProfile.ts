import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userProfileKeys,
  type EditableUserProfile,
  type UserIdentity,
  type UserProfile,
} from '@/entities/user';
import { updateUserProfile } from '../api/updateUserProfile';

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (profile, { profileId }) => {
      queryClient.setQueryData<UserIdentity>(
        userProfileKeys.identity(profileId),
        { name: profile.name, photoUrl: profile.photoUrl },
      )
      queryClient.setQueryData<UserProfile | null>(
        userProfileKeys.detail(profileId),
        (currentProfile) => mergeProfile(profileId, currentProfile, profile),
      )
    },
  })
}

function mergeProfile(
  profileId: string,
  currentProfile: UserProfile | null | undefined,
  profile: EditableUserProfile,
): UserProfile {
  if (!currentProfile) {
    return {
      id: profileId,
      ...profile,
      photoAlt: `Portrait of ${profile.name}`,
      postsCount: 0,
      posts: [],
      comments: [],
    }
  }

  return {
    ...currentProfile,
    ...profile,
    photoAlt: `Portrait of ${profile.name}`,
  }
}