import { useQuery } from '@tanstack/react-query';
import { getUserIdentity } from '../api/getUserIdentity';
import { userProfileKeys } from './userProfileKeys';

export function useUserIdentity(profileId: string | null) {
  return useQuery({
    queryKey: userProfileKeys.identity(profileId ?? ''),
    queryFn: () => (profileId ? getUserIdentity(profileId) : null),
    enabled: profileId !== null,
    staleTime: 30_000,
  })
}