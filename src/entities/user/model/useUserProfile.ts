import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/getUserProfile';
import { userProfileKeys } from './userProfileKeys';

export function useUserProfile(profileId: string) {
  return useQuery({
    queryKey: userProfileKeys.detail(profileId),
    queryFn: () => getUserProfile(profileId),
    staleTime: 30_000,
  })
}