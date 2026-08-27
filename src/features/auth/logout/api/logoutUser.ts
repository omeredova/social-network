import { signOut } from 'firebase/auth';
import { firebaseAuth } from '@/shared/config/firebase';

export function logoutUser(): Promise<void> {
  return signOut(firebaseAuth)
}
