import { useEffect, useState, type ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { EchoChatStore } from '../model/EchoChatStore';
import { EchoChatContext } from '../model/echoChatContext';
import { ConnectionNotification } from './ConnectionNotification';

interface EchoChatProviderProps {
  readonly children: ReactNode
}

export const EchoChatProvider = observer(function EchoChatProvider({
  children,
}: EchoChatProviderProps) {
  const [chat] = useState(() => new EchoChatStore())

  useEffect(() => {
    chat.connect()
    return () => {
      chat.disconnect()
    }
  }, [chat])

  return (
    <EchoChatContext.Provider value={chat}>
      {children}
      <ConnectionNotification status={chat.status} />
    </EchoChatContext.Provider>
  )
})