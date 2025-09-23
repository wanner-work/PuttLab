import type HistoryEntry from '@/interfaces/data/HistoryEntry.ts'
import { useState } from 'react'

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

  return {
    history,
    addHistoryEntry,
    getLastHistoryEntry,
    removeLastHistoryEntry
  }
}
