import RecorderControl from '@/components/sessions/recorder/control/RecorderControl'
import QUERY from '@/constants/QUERY'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session'
import useHistory from '@/hooks/sessions/useHistory'
import type ModeStep from '@/interfaces/data/mode/ModeStep'
import createSession from '@/methods/data/create/createSession'
import updateSession from '@/methods/data/update/updateSession'
import vibrate from '@/methods/effects/vibrate'
import { ImpactStyle } from '@capacitor/haptics'
import { useMutation } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface Props {
  step: ModeStep
  index: number
  modeRun: ModeRun
  initialSession?: Session
  onComplete: () => void
}

export default function Step({
  step,
  index,
  initialSession,
  modeRun
}: Readonly<Props>) {
  const [session, setSession] = useState<Session | undefined>(undefined)

  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const debouncedAttempts = useDebounce(attempts, 400)
  const debouncedHits = useDebounce(hits, 400)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createSession({
        distance: step.distance,
        maxAttempts: step.repetitions,
        modeRun: modeRun
      }),
    onSuccess: (newSession) => {
      setSession(newSession)
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.MODE_RUN, modeRun.id]
      })
    }
  })

  const { mutate: update } = useMutation({
    mutationFn: updateSession
  })

  useEffect(() => {
    if (session || isPending) {
      return
    }

    if (initialSession) {
      setSession(initialSession)
      setAttempts(initialSession.attempts)
      setHits(initialSession.hits)
    } else {
      mutate()
    }
  }, [initialSession, session, mutate, isPending])

  const {
    addHistoryEntry,
    getLastHistoryEntry,
    removeLastHistoryEntry,
    history
  } = useHistory()

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
      update(session)
    }

    removeLastHistoryEntry()
  }

  /**
   * Auto-save session progress after debounce
   */
  useEffect(() => {
    if (!session) return
    if (debouncedAttempts === 0 && debouncedHits === 0) return
    if (debouncedAttempts === session.attempts) return

    session.attempts = debouncedAttempts
    session.hits = debouncedHits

    update(session)
  }, [debouncedAttempts, debouncedHits, session, update])

  return (
    <>
      <div>
        <h2>Step {index + 1}</h2>
        <p>{step.label}</p>
        <AnimatePresence mode="wait">
          {session ? (
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p>Session ID: {session.id}</p>
              <p>Distance: {session.distance} meters</p>
              <p>Max Attempts: {session.maxAttempts ?? 'Unlimited'}</p>

              <p>Hits: {session.hits}</p>
              <p>Attempts: {session.attempts}</p>
            </motion.div>
          ) : (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 className="animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <RecorderControl
        attempts={attempts}
        session={session}
        history={history}
        hit={onHit}
        miss={onMiss}
        batch={onBatch}
        undo={onUndo}
      />
    </>
  )
}
