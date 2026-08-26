import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCurrentTime } from './useCurrentTime'

afterEach(() => {
  vi.useRealTimers()
})

describe('useCurrentTime', () => {
  it('updates the current time at the configured interval', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-25T12:00:00Z'))
    const { result } = renderHook(() => useCurrentTime(1_000))

    expect(result.current).toBe(new Date('2026-08-25T12:00:00Z').getTime())

    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    expect(result.current).toBe(new Date('2026-08-25T12:00:01Z').getTime())
  })
})
