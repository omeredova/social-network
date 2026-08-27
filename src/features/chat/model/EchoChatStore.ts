import { makeAutoObservable } from 'mobx';
import type { ChatMessage, MessageSender } from '@/entities/message';
import {
  EchoWebSocketClient,
  type EchoConnectionStatus,
  type EchoMessagePayload,
} from '../api/echoWebSocketClient';

export interface EchoChatState {
  readonly messages: readonly ChatMessage[]
  readonly status: EchoConnectionStatus
  connect: () => void
  disconnect: () => void
  sendMessage: (
    payload: EchoMessagePayload,
    localSender: MessageSender,
  ) => boolean
}

export class EchoChatStore implements EchoChatState {
  messages: readonly ChatMessage[] = []
  status: EchoConnectionStatus = 'connecting'

  private readonly client: EchoWebSocketClient

  constructor() {
    this.client = new EchoWebSocketClient({
      onStatusChange: (status) => {
        this.setStatus(status)
      },
      onMessage: (payload) => {
        this.receiveMessage(payload)
      },
    })

    makeAutoObservable<this, 'client'>(
      this,
      { client: false },
      { autoBind: true },
    )
  }

  connect(): void {
    this.client.connect()
  }

  disconnect(): void {
    this.client.disconnect()
  }

  sendMessage(
    payload: EchoMessagePayload,
    localSender: MessageSender,
  ): boolean {
    if (!this.client.send(payload)) return false

    this.messages = [
      ...this.messages,
      { ...payload, id: `sent-${payload.id}`, sender: localSender },
    ]
    return true
  }

  private setStatus(status: EchoConnectionStatus): void {
    this.status = status
  }

  private receiveMessage(payload: EchoMessagePayload): void {
    this.messages = [
      ...this.messages,
      { ...payload, id: `echo-${payload.id}` },
    ]
  }
}