import type HistoryEntry from '@/interfaces/data/HistoryEntry.ts'
import { useMemo, useState } from 'react'

export default function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const addHistoryEntry = (attempts: number, hits: number) => {
    setHistory((prevHistory) => [...prevHistory, { attempts, hits }])
  }

  const getLastHistoryEntry = () => {
    return history[history.length - 1]
  }

  const removeLastHistoryEntry = () => {
    setHistory((prevHistory) => prevHistory.slice(0, -1))
  }

  const latest = useMemo(() => {
    if (history.length === 0) return undefined
    const lastEntry = history[history.length - 1]
    if (lastEntry.attempts === 1) {
      return lastEntry.hits === 1 ? ('hit' as const) : ('miss' as const)
    }
    return lastEntry.hits
  }, [history])

  return {
    history,
    latest,
    addHistoryEntry,
    getLastHistoryEntry,
    removeLastHistoryEntry
  }
}
