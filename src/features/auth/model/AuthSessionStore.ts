import { makeAutoObservable } from 'mobx';
import type { Auth, Unsubscribe, User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export class AuthSessionStore {
  user: User | null
  isLoading = true

  private unsubscribe: Unsubscribe | null = null
  private readonly auth: Auth

  constructor(auth: Auth) {
    this.auth = auth
    this.user = auth.currentUser

    makeAutoObservable<this, 'auth' | 'unsubscribe'>(
      this,
      { auth: false, unsubscribe: false },
      { autoBind: true, deep: false },
    )
  }

  start(): void {
    if (this.unsubscribe) return

    this.unsubscribe = onAuthStateChanged(this.auth, (user) => {
      this.setUser(user)
    })
  }

  stop(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
  }

  private setUser(user: User | null): void {
    this.user = user
    this.isLoading = false
  }
}