import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { firebaseAuth } from '@/shared/config/firebase';

export function ensureLocalAuthPersistence(): Promise<void> {
  return setPersistence(firebaseAuth, browserLocalPersistence)
}