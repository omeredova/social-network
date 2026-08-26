import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';
import { useMessageParticipants, type MessageSender } from '@/entities/message';
import type { UserProfile } from '@/entities/user';
import { useAuthUser } from '@/features/auth';
import { useEchoChat } from '@/features/chat';
import { MessagesPanelStore } from './MessagesPanelStore';

export interface UseMessagesPanelResult {
  readonly store: MessagesPanelStore
  readonly status: ReturnType<typeof useEchoChat>['status']
  readonly isLoading: boolean
  readonly isError: boolean
  readonly submitMessage: (event: SyntheticEvent<HTMLFormElement>) => void
  readonly handleComposerKeyDown: (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => void
}

export function useMessagesPanel(
  initialProfile?: UserProfile | null,
): UseMessagesPanelResult {
  const { user } = useAuthUser()
  const chat = useEchoChat()
  const participantsQuery = useMessageParticipants()
  const registeredUser = useMemo<MessageSender>(
    () => ({
      id: user?.uid ?? '',
      name: user?.displayName ?? 'You',
      username: user?.email?.split('@')[0] ?? 'you',
      photoUrl: user?.photoURL ?? '',
    }),
    [user?.displayName, user?.email, user?.photoURL, user?.uid],
  )
  const [store] = useState(
    () =>
      new MessagesPanelStore(
        chat,
        registeredUser,
        participantsQuery.data ?? [],
        initialProfile,
      ),
  )

  useEffect(() => {
    store.setRegisteredUser(registeredUser)
  }, [registeredUser, store])

  useEffect(() => {
    store.setParticipants(participantsQuery.data ?? [], initialProfile)
  }, [initialProfile, participantsQuery.data, store])

  const submitMessage = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    store.sendDraft(Math.round(performance.timeOrigin + event.timeStamp))
  }

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }

  return {
    store,
    status: chat.status,
    isLoading: participantsQuery.isLoading,
    isError: participantsQuery.isError,
    submitMessage,
    handleComposerKeyDown,
  }
}
