import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/getUserProfile';
import { userProfileKeys } from './userProfileKeys';

export function useUserProfile(profileId: string | null) {
  return useQuery({
    queryKey: userProfileKeys.detail(profileId ?? ''),
    queryFn: () => (profileId ? getUserProfile(profileId) : null),
    enabled: profileId !== null,
    staleTime: 30_000,
  })
}