import { createContext } from 'react';
import type { EchoChatState } from './EchoChatStore';

export const EchoChatContext = createContext<EchoChatState | null>(null)