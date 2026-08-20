import {
  createUserWithEmailAndPassword,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/shared/config/firebase';
import { ensureLocalAuthPersistence } from '../../api/ensureLocalAuthPersistence';
import type { AuthCredentials } from '../../model/authCredentials';

export async function registerUser({
  email,
  password,
}: AuthCredentials): Promise<UserCredential> {
  await ensureLocalAuthPersistence()

  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  )

  await setDoc(doc(firestore, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
  })

  return userCredential
}