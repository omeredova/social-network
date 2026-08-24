import type { AuthFieldErrors } from './authCredentials';

export interface AuthError {
  message: string
  fieldErrors: AuthFieldErrors
}

export function getCommonAuthError(code: string | null): AuthError | null {
  switch (code) {
    case 'auth/invalid-email':
      return {
        message: 'Enter a valid email address.',
        fieldErrors: { email: 'Enter a valid email address.' },
      }
    case 'auth/network-request-failed':
      return {
        message: 'Check your internet connection and try again.',
        fieldErrors: {},
      }
    default:
      return null
  }
}
