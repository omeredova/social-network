import { describe, expect, it } from 'vitest';
import {
  validateAuthCredentials,
  validatePasswordConfirmation,
} from './authCredentials';

function createCredentialsFormData(email: string, password: string): FormData {
  const formData = new FormData()
  formData.set('email', email)
  formData.set('password', password)
  return formData
}

describe('validateAuthCredentials', () => {
  it('accepts a valid email and password', () => {
    const result = validateAuthCredentials(
      createCredentialsFormData('person@example.com', 'secret1'),
    )

    expect(result).toEqual({
      credentials: { email: 'person@example.com', password: 'secret1' },
      errors: {},
    })
  })

  it('rejects malformed email and a short password', () => {
    const result = validateAuthCredentials(
      createCredentialsFormData('invalid-email', '123'),
    )

    expect(result.credentials).toBeNull()
    expect(result.errors.email).toBe('Enter a valid email address.')
    expect(result.errors.password).toBe(
      'Password must contain at least 6 characters.',
    )
  })

  it('rejects whitespace in credentials', () => {
    const result = validateAuthCredentials(
      createCredentialsFormData('person @example.com', 'secret 1'),
    )

    expect(result.credentials).toBeNull()
    expect(result.errors.email).toBe('Email cannot contain spaces.')
    expect(result.errors.password).toBe('Password cannot contain spaces.')
  })
})

describe('validatePasswordConfirmation', () => {
  it('rejects a password mismatch', () => {
    const formData = createCredentialsFormData('person@example.com', 'secret1')
    formData.set('passwordConfirmation', 'secret2')

    expect(validatePasswordConfirmation(formData)).toBe(
      'Passwords do not match.',
    )
  })

  it('accepts a matching password', () => {
    const formData = createCredentialsFormData('person@example.com', 'secret1')
    formData.set('passwordConfirmation', 'secret1')

    expect(validatePasswordConfirmation(formData)).toBeNull()
  })
})