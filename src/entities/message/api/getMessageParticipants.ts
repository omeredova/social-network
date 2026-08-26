import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';
import type { MessageSender } from '../model/types';

function isMessageParticipant(
  value: unknown,
): value is Omit<MessageSender, 'id'> {
  if (!value || typeof value !== 'object') return false
  const participant = value as Record<string, unknown>

  return (
    typeof participant.name === 'string' &&
    typeof participant.username === 'string' &&
    typeof participant.photoUrl === 'string'
  )
}

export async function getMessageParticipants(): Promise<
  readonly MessageSender[]
> {
  const snapshot = await getDocs(collection(firestore, 'users'))

  return snapshot.docs.flatMap((document) => {
    const data: unknown = document.data()
    return isMessageParticipant(data) ? [{ id: document.id, ...data }] : []
  })
}