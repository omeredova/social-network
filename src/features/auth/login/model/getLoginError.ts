import { getFirebaseErrorCode } from '@/shared/lib/firebase/getFirebaseErrorCode';
import { getCommonAuthError, type AuthError } from '../../model/authError';

export function getLoginError(error: unknown): AuthError {
  const code = getFirebaseErrorCode(error)
  const commonError = getCommonAuthError(code)
  if (commonError) return commonError

  switch (code) {
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
    case 'auth/user-disabled':
      return { message: 'This account has been disabled.', fieldErrors: {} }
    case 'auth/too-many-requests':
      return {
        message: 'Too many attempts. Please wait and try again.',
        fieldErrors: {},
      }
    default:
      return { message: 'Unable to log in. Please try again.', fieldErrors: {} }
  }
}
