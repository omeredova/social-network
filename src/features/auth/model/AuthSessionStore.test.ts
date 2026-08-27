import type { Auth, User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthSessionStore } from './AuthSessionStore'

vi.mock('firebase/auth', async (importOriginal) => {
  const original = await importOriginal<typeof import('firebase/auth')>()
  return { ...original, onAuthStateChanged: vi.fn() }
})

const mockedOnAuthStateChanged = vi.mocked(onAuthStateChanged)

describe('AuthSessionStore', () => {
  beforeEach(() => {
    mockedOnAuthStateChanged.mockReset()
  })

  it('owns one subscription and disposes it', () => {
    const unsubscribe = vi.fn()
    const auth = { currentUser: null } as unknown as Auth
    mockedOnAuthStateChanged.mockReturnValue(unsubscribe)
    const store = new AuthSessionStore(auth)

    store.start()
    store.start()

    expect(mockedOnAuthStateChanged).toHaveBeenCalledOnce()

    store.stop()

    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('updates the observable session from Firebase', () => {
    const user = { uid: 'user-1' } as User
    const auth = { currentUser: null } as unknown as Auth
    mockedOnAuthStateChanged.mockImplementation((_auth, listener) => {
      if (typeof listener === 'function') listener(user)
      return vi.fn()
    })
    const store = new AuthSessionStore(auth)

    store.start()

    expect(store.user).toBe(user)
    expect(store.isLoading).toBe(false)
  })
})
