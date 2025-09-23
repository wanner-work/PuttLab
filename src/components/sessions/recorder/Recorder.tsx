import { Button } from '@/components/ui/button.tsx'
import { Undo } from 'lucide-react'
import { memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import RecorderBatch from './RecorderBatch'
import RecorderSingle from './RecorderSingle'

interface Props {
  disabled?: boolean
  hit: () => void
  miss: () => void
  batch: (attempts: number, hits: number) => void
  disabledUndo?: boolean
  latest?: 'hit' | 'miss' | number
  undo: () => void
}

export default memo(Recorder)

function Recorder({
  latest,
  hit,
  miss,
  batch,
  disabled,
  undo,
  disabledUndo
}: Readonly<Props>) {
  return (
    <div className="">
      <Tabs defaultValue="byPutt">
        <div className="flex gap-2">
          <TabsList className="relative h-auto w-full">
            <TabsTrigger
              value="byPutt"
              className="w-full p-2"
              disabled={disabled}
            >
              By Putt
            </TabsTrigger>
            <TabsTrigger
              value="byBatch"
              className="w-full p-2"
              disabled={disabled}
            >
              By Batch
            </TabsTrigger>
          </TabsList>
          <div className="bg-card/30 text-card-foreground relative flex h-auto items-center justify-center rounded-lg border p-[3px] shadow-sm">
            <Button
              variant="outline"
              className="!bg-background size-[42px] rounded-md border border-transparent !px-2 disabled:!bg-transparent"
              disabled={disabledUndo}
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
            disabled={disabled}
            latest={typeof latest === 'string' ? latest : undefined}
          />
        </TabsContent>
        <TabsContent value="byBatch" className="flex flex-col gap-3">
          <RecorderBatch
            batch={batch}
            disabled={disabled}
            latest={typeof latest === 'number' ? latest : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
