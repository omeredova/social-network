export function formatRelativeTime(date: Date, now = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1_000))
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes.toString()} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours.toString()} hr`

  const days = Math.floor(hours / 24)
  return `${days.toString()} day${days === 1 ? '' : 's'}`
}
