import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ECHO_WEBSOCKET_URL,
  EchoWebSocketClient,
  type EchoConnectionStatus,
  type EchoMessagePayload,
} from './echoWebSocketClient'

class FakeWebSocket extends EventTarget {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSED = 3
  static instances: FakeWebSocket[] = []

  readyState = FakeWebSocket.CONNECTING
  readonly sent: string[] = []
  readonly url: string

  constructor(url: string) {
    super()
    this.url = url
    FakeWebSocket.instances.push(this)
  }

  open(): void {
    this.readyState = FakeWebSocket.OPEN
    this.dispatchEvent(new Event('open'))
  }

  send(data: string): void {
    this.sent.push(data)
  }

  echo(data: string): void {
    this.dispatchEvent(new MessageEvent('message', { data }))
  }

  close(): void {
    this.readyState = FakeWebSocket.CLOSED
    this.dispatchEvent(new Event('close'))
  }
}

describe('EchoWebSocketClient', () => {
  beforeEach(() => {
    FakeWebSocket.instances = []
    vi.stubGlobal('WebSocket', FakeWebSocket)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('connects, sends typed JSON, and receives the echoed payload', () => {
    const statuses: EchoConnectionStatus[] = []
    const received: EchoMessagePayload[] = []
    const client = new EchoWebSocketClient({
      onStatusChange: (status) => statuses.push(status),
      onMessage: (payload) => received.push(payload),
    })
    const payload: EchoMessagePayload = {
      id: 'message-1',
      conversationId: 'design-review',
      content: 'Hello',
      sender: {
        id: 'sophia',
        name: 'Sophia',
        username: 'sophia',
        photoUrl: '',
      },
      sentAt: 1_777_777_777_777,
    }

    client.connect()
    const socket = FakeWebSocket.instances[0]
    expect(socket?.url).toBe(ECHO_WEBSOCKET_URL)
    socket?.open()

    expect(client.send(payload)).toBe(true)
    expect(socket?.sent).toEqual([JSON.stringify(payload)])
    socket?.echo(JSON.stringify(payload))

    expect(received).toEqual([payload])
    expect(statuses).toEqual(['connecting', 'connected'])
    client.disconnect()
  })
})
