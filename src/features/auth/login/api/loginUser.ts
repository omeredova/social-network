import {
  signInWithEmailAndPassword,
  type UserCredential,
} from 'firebase/auth';
import { firebaseAuth } from '@/shared/config/firebase';
import { ensureLocalAuthPersistence } from '../../api/ensureLocalAuthPersistence';
import type { AuthCredentials } from '../../model/authCredentials';

export async function loginUser({
  email,
  password,
}: AuthCredentials): Promise<UserCredential> {
  await ensureLocalAuthPersistence()

  return signInWithEmailAndPassword(firebaseAuth, email, password)
}