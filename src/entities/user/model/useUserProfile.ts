import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/getUserProfile';
import { getUserProfileById } from './users.mock';
import { userProfileKeys } from './userProfileKeys';

export function useUserProfile(profileId: string) {
  return useQuery({
    queryKey: userProfileKeys.detail(profileId),
    queryFn: () => getUserProfile(profileId),
    initialData: () => getUserProfileById(profileId),
    staleTime: 30_000,
  })
}