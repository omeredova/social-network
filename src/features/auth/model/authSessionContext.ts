import { createContext } from 'react';
import type { AuthSessionStore } from './AuthSessionStore';

export const AuthSessionContext = createContext<AuthSessionStore | null>(null)