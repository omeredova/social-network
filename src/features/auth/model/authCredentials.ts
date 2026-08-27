export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthFieldErrors {
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface AuthCredentialsValidationResult {
  credentials: AuthCredentials | null;
  errors: AuthFieldErrors;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

export function validateAuthCredentials(
  formData: FormData,
): AuthCredentialsValidationResult {
  const email = formData.get('email')
  const password = formData.get('password')
  const errors: AuthFieldErrors = {}

  if (typeof email !== 'string' || !email) {
    errors.email = 'Email is required.'
  } else if (/\s/.test(email)) {
    errors.email = 'Email cannot contain spaces.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (typeof password !== 'string' || !password) {
    errors.password = 'Password is required.'
  } else if (/\s/.test(password)) {
    errors.password = 'Password cannot contain spaces.'
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = 'Password must contain at least 6 characters.'
  }

  if (
    Object.keys(errors).length > 0 ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return { credentials: null, errors }
  }

  return { credentials: { email, password }, errors }
}

export function validatePasswordConfirmation(
  formData: FormData,
): string | null {
  const password = formData.get('password')
  const confirmation = formData.get('passwordConfirmation')

  if (typeof confirmation !== 'string' || !confirmation) {
    return 'Confirm your password.'
  }

  if (/\s/.test(confirmation)) {
    return 'Password confirmation cannot contain spaces.'
  }

  if (typeof password === 'string' && confirmation !== password) {
    return 'Passwords do not match.'
  }

  return null
}
