import type { AuthFieldErrors } from './authCredentials';

export interface AuthError {
  message: string;
  fieldErrors: AuthFieldErrors;
}
