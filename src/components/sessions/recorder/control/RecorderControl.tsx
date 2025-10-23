import { Button } from '@/components/ui/button.tsx'
import type { Session } from '@/data/entities/session.ts'
import useHistory from '@/hooks/sessions/useHistory.ts'
import type HistoryEntry from '@/interfaces/data/HistoryEntry.ts'
import { Undo } from 'lucide-react'
import { memo, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs.tsx'
import RecorderBatch from './RecorderControlBatch.tsx'
import RecorderSingle from './RecorderControlSingle.tsx'

interface Props {
  session: Session | null | undefined
  attempts: number
  history: HistoryEntry[]
  disabled?: boolean
  hit: () => void
  miss: () => void
  batch: (attempts: number, hits: number) => void
  undo: () => void
}

export default memo(RecorderControl)

function RecorderControl({
  session,
  attempts,
  history,
  disabled,
  hit,
  miss,
  batch,
  undo
}: Readonly<Props>) {
  const isDisabled = useMemo(() => {
    if (!session) return true
    if (disabled) return true
    if (session.maxAttempts) {
      return attempts >= session.maxAttempts
    }
  }, [session, attempts, disabled])

  const { getLatest } = useHistory()

  const latest = useMemo(() => {
    return getLatest(history)
  }, [history, getLatest])

  return (
    <div>
      <Tabs defaultValue="byPutt">
        <div className="flex gap-2">
          <TabsList className="relative h-auto w-full">
            <TabsTrigger
              value="byPutt"
              className="w-full p-2"
              disabled={isDisabled}
            >
              By Putt
            </TabsTrigger>
            <TabsTrigger
              value="byBatch"
              className="w-full p-2"
              disabled={isDisabled}
            >
              By Batch
            </TabsTrigger>
          </TabsList>
          <div className="bg-card/30 text-card-foreground relative flex h-auto items-center justify-center rounded-2xl border p-[3px] shadow-sm">
            <Button
              variant="outline"
              className="!bg-background size-[42px] border border-transparent !px-2 disabled:!bg-transparent"
              disabled={history?.length === 0}
              onClick={() => undo()}
            >
              <Undo />
            </Button>
          </div>
        </div>

        <TabsContent value="byPutt" className="flex flex-col gap-2">
          <RecorderSingle
            hit={hit}
            miss={miss}
            disabled={isDisabled}
            latest={typeof latest === 'string' ? latest : undefined}
          />
        </TabsContent>
        <TabsContent value="byBatch" className="flex flex-col gap-3">
          <RecorderBatch
            batch={batch}
            attempts={attempts}
            session={session}
            disabled={isDisabled}
            latest={typeof latest === 'number' ? latest : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
