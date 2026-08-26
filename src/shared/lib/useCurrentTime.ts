import { useEffect, useState } from 'react';

const DEFAULT_UPDATE_INTERVAL_MS = 30_000

export function useCurrentTime(
  updateIntervalMs = DEFAULT_UPDATE_INTERVAL_MS,
): number {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(Date.now())
    }

    updateCurrentTime()
    const intervalId = window.setInterval(updateCurrentTime, updateIntervalMs)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [updateIntervalMs])

  return currentTime
}