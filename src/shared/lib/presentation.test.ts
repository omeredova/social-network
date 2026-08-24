import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './formatRelativeTime'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('creates initials while ignoring surrounding and repeated whitespace', () => {
    expect(getInitials('  Maya   Brooks  ')).toBe('MB')
  })

  it('returns an empty string for an empty name', () => {
    expect(getInitials('   ')).toBe('')
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-08-24T12:00:00Z').getTime()

  it.each([
    ['2026-08-24T11:59:30Z', 'just now'],
    ['2026-08-24T11:30:00Z', '30 min'],
    ['2026-08-24T10:00:00Z', '2 hr'],
    ['2026-08-23T12:00:00Z', '1 day'],
    ['2026-08-21T12:00:00Z', '3 days'],
  ])('formats %s as %s', (date, expected) => {
    expect(formatRelativeTime(new Date(date), now)).toBe(expected)
  })
})
