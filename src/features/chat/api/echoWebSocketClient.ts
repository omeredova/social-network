import type { ChatMessage } from '@/entities/message';

export const ECHO_WEBSOCKET_URL = 'wss://ws.ifelse.io'

export type EchoConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'

export type EchoMessagePayload = ChatMessage

interface EchoWebSocketClientOptions {
  readonly onMessage: (payload: EchoMessagePayload) => void
  readonly onStatusChange: (status: EchoConnectionStatus) => void
  readonly reconnectDelayMs?: number
}

const isEchoMessagePayload = (value: unknown): value is EchoMessagePayload => {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  const sender = record.sender
  return (
    typeof record.id === 'string' &&
    typeof record.conversationId === 'string' &&
    typeof record.content === 'string' &&
    typeof record.sentAt === 'number' &&
    typeof sender === 'object' &&
    sender !== null &&
    typeof (sender as Record<string, unknown>).id === 'string' &&
    typeof (sender as Record<string, unknown>).name === 'string' &&
    typeof (sender as Record<string, unknown>).username === 'string' &&
    typeof (sender as Record<string, unknown>).photoUrl === 'string'
  )
}

export class EchoWebSocketClient {
  private socket: WebSocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private shouldReconnect = false
  private readonly options: EchoWebSocketClientOptions

  constructor(options: EchoWebSocketClientOptions) {
    this.options = options
  }

  connect(): void {
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    ) return

    this.shouldReconnect = true
    this.options.onStatusChange('connecting')
    const socket = new WebSocket(ECHO_WEBSOCKET_URL)
    this.socket = socket

    socket.addEventListener('open', () => {
      this.options.onStatusChange('connected')
    })
    socket.addEventListener('message', (event) => {
      if (typeof event.data !== 'string') return
      try {
        const payload: unknown = JSON.parse(event.data)
        if (isEchoMessagePayload(payload)) this.options.onMessage(payload)
      } catch {
        // Ignore messages that do not use the chat payload format.
      }
    })
    socket.addEventListener('error', () => {
      this.options.onStatusChange('error')
      socket.close()
    })
    socket.addEventListener('close', () => {
      if (this.socket === socket) this.socket = null
      if (!this.shouldReconnect) {
        this.options.onStatusChange('disconnected')
        return
      }
      this.options.onStatusChange('connecting')
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null
        this.connect()
      }, this.options.reconnectDelayMs ?? 2_000)
    })
  }

  send(payload: EchoMessagePayload): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) return false
    this.socket.send(JSON.stringify(payload))
    return true
  }

  disconnect(): void {
    this.shouldReconnect = false
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    this.socket?.close()
    this.socket = null
    this.options.onStatusChange('disconnected')
  }
}