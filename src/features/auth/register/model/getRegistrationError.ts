import { getFirebaseErrorCode } from '@/shared/lib/firebase/getFirebaseErrorCode';
import type { AuthError } from '../../model/authError';

export function getRegistrationError(error: unknown): AuthError {
  switch (getFirebaseErrorCode(error)) {
    case 'auth/email-already-in-use':
      return {
        message: 'An account with this email already exists.',
        fieldErrors: { email: 'An account with this email already exists.' },
      }
    case 'auth/invalid-email':
      return {
        message: 'Enter a valid email address.',
        fieldErrors: { email: 'Enter a valid email address.' },
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
    case 'auth/network-request-failed':
      return {
        message: 'Check your internet connection and try again.',
        fieldErrors: {},
      }
    default:
      return {
        message: 'Unable to create your account. Please try again.',
        fieldErrors: {},
      }
  }
}
