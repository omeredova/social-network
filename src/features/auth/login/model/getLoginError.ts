import { getFirebaseErrorCode } from '@/shared/lib/firebase/getFirebaseErrorCode';
import type { AuthError } from '../../model/authError';

export function getLoginError(error: unknown): AuthError {
  switch (getFirebaseErrorCode(error)) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return {
        message: 'The email or password is incorrect.',
        fieldErrors: {
          email: 'Check your email.',
          password: 'Check your password.',
        },
      }
    case 'auth/invalid-email':
      return {
        message: 'Enter a valid email address.',
        fieldErrors: { email: 'Enter a valid email address.' },
      }
    case 'auth/user-disabled':
      return { message: 'This account has been disabled.', fieldErrors: {} }
    case 'auth/too-many-requests':
      return {
        message: 'Too many attempts. Please wait and try again.',
        fieldErrors: {},
      }
    case 'auth/network-request-failed':
      return {
        message: 'Check your internet connection and try again.',
        fieldErrors: {},
      }
    default:
      return { message: 'Unable to log in. Please try again.', fieldErrors: {} }
  }
}
