import { useContext } from 'react';
import type { EchoChatState } from './EchoChatStore';
import { EchoChatContext } from './echoChatContext';

export function useEchoChat(): EchoChatState {
  const chat = useContext(EchoChatContext)
  if (!chat) {
    throw new Error('useEchoChat must be used within EchoChatProvider')
  }
  return chat
}