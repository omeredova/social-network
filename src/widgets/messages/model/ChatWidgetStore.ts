import { makeAutoObservable } from 'mobx';

export class ChatWidgetStore {
  isOpen = false
  isChoosingConversation = true

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  toggle(): void {
    this.isOpen = !this.isOpen
  }

  close(): void {
    this.isOpen = false
  }

  showConversationList(): void {
    this.isChoosingConversation = true
  }

  showSelectedConversation(): void {
    this.isChoosingConversation = false
  }
}