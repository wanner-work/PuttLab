import { memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import RecorderBatch from './RecorderBatch'
import RecorderSingle from './RecorderSingle'

interface Props {
  disabled?: boolean
  hit: () => void
  miss: () => void
  batch: (attempts: number, hits: number) => void
}

export default memo(Recorder)

function Recorder({ hit, miss, batch, disabled }: Props) {
  return (
    <div>
      <Tabs defaultValue="byPutt">
        <TabsList className="h-auto w-full">
          <TabsTrigger value="byPutt" className="p-2" disabled={disabled}>
            By Putt
          </TabsTrigger>
          <TabsTrigger value="byBatch" className="p-2" disabled={disabled}>
            By Batch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="byPutt" className="flex flex-col gap-2">
          <RecorderSingle hit={hit} miss={miss} disabled={disabled} />
        </TabsContent>
        <TabsContent value="byBatch" className="flex flex-col gap-2">
          <RecorderBatch batch={batch} disabled={disabled} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
