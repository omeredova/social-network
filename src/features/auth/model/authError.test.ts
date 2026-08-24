import { describe, expect, it } from 'vitest'
import { getCommonAuthError } from './authError'

describe('getCommonAuthError', () => {
  it('maps errors shared by login and registration', () => {
    expect(getCommonAuthError('auth/invalid-email')).toEqual({
      message: 'Enter a valid email address.',
      fieldErrors: { email: 'Enter a valid email address.' },
    })
    expect(getCommonAuthError('auth/network-request-failed')).toEqual({
      message: 'Check your internet connection and try again.',
      fieldErrors: {},
    })
  })

  it('leaves flow-specific errors to their respective mapper', () => {
    expect(getCommonAuthError('auth/wrong-password')).toBeNull()
  })
})
