import { getFirebaseErrorCode } from '@/shared/lib/firebase/getFirebaseErrorCode';
import { getCommonAuthError, type AuthError } from '../../model/authError';

export function getRegistrationError(error: unknown): AuthError {
  const code = getFirebaseErrorCode(error)
  const commonError = getCommonAuthError(code)
  if (commonError) return commonError

  switch (code) {
    case 'auth/email-already-in-use':
      return {
        message: 'An account with this email already exists.',
        fieldErrors: { email: 'An account with this email already exists.' },
      }
    case 'auth/weak-password':
      return {
        message: 'Use a stronger password with at least 6 characters.',
        fieldErrors: { password: 'Use a stronger password.' },
      }
    case 'auth/operation-not-allowed':
      return {
        message: 'Email registration is not enabled for this Firebase project.',
        fieldErrors: {},
      }
    default:
      return {
        message: 'Unable to create your account. Please try again.',
        fieldErrors: {},
      }
  }
}
