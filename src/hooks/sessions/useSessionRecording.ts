import QUERY from '@/constants/QUERY'
import type { Session } from '@/data/entities/session'
import vibrate from '@/methods/effects/vibrate'
import { ImpactStyle } from '@capacitor/haptics'
import { useBlocker } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import useSessionMutation from '../data/session/useSessionMutation'
import useHistory from './useHistory'

export default function useSessionRecording(
  session: Session | null | undefined
) {
  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const debouncedAttempts = useDebounce(attempts, 400)
  const debouncedHits = useDebounce(hits, 400)

  const {
    addHistoryEntry,
    getLastHistoryEntry,
    removeLastHistoryEntry,
    history
  } = useHistory()

  const { mutate } = useSessionMutation()

  const onHit = () => {
    setHits((h) => h + 1)
    setAttempts((a) => a + 1)

    addHistoryEntry(1, 1)
  }

  const onMiss = () => {
    setAttempts((a) => a + 1)

    addHistoryEntry(1, 0)
  }

  const onBatch = (attempts: number, hits: number) => {
    setHits((h) => h + hits)
    setAttempts((a) => a + attempts)

    addHistoryEntry(attempts, hits)
  }

  const onUndo = () => {
    vibrate(ImpactStyle.Medium)

    const lastEntry = getLastHistoryEntry()

    const newHits = hits - (lastEntry?.hits || 0)
    const newAttempts = attempts - (lastEntry?.attempts || 0)

    setHits(newHits)
    setAttempts(newAttempts)

    if (session && (newAttempts === 0 || newHits === 0)) {
      session.hits = newHits
      session.attempts = newAttempts

      // mutate session here because the auto-save useEffect won't be triggered
      // when both hits and attempts are 0
      mutate(session)
    }

    removeLastHistoryEntry()
  }

  /**
   * As soon as the session is loaded, set the hits and attempts
   */
  useEffect(() => {
    if (session) {
      setHits(session.hits)
      setAttempts(session.attempts)
    }
  }, [session])

  /**
   * Auto-save session progress after debounce
   */
  useEffect(() => {
    if (!session) return
    if (debouncedAttempts === 0 && debouncedHits === 0) return
    if (debouncedAttempts === session.attempts) return

    session.attempts = debouncedAttempts
    session.hits = debouncedHits

    mutate(session)
  }, [debouncedAttempts, debouncedHits, session, mutate])

  /**
   * Because the recorder saves progress with debounce,
   * we need to block the navigation and save the progress first.
   * Once the progress is saved, we can allow the navigation.
   */
  useBlocker({
    shouldBlockFn: () => {
      if (!session) return false

      return new Promise<boolean>((resolve) => {
        session.attempts = attempts
        session.hits = hits

        if (
          debouncedAttempts === session.attempts &&
          debouncedHits === session.hits
        ) {
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SESSION, session.id]
          })
          resolve(false)
        } else {
          mutate(session)
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SESSION, session.id]
          })
          resolve(false)
        }
      })
    }
  })

  return {
    hits,
    attempts,
    debouncedHits,
    debouncedAttempts,
    history,
    onHit,
    onMiss,
    onBatch,
    onUndo
  }
}
