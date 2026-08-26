import { useQuery } from '@tanstack/react-query';
import { getMessageParticipants } from '../api/getMessageParticipants';
import { messageParticipantKeys } from './messageParticipantKeys';

export function useMessageParticipants() {
  return useQuery({
    queryKey: messageParticipantKeys.all,
    queryFn: getMessageParticipants,
    staleTime: 30_000,
  })
}