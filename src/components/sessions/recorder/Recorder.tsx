import { memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import RecorderBatch from './RecorderBatch'
import RecorderSingle from './RecorderSingle'

interface Props {
  disabled?: boolean
  hit: () => void
  miss: () => void
  batch: (attempts: number, hits: number) => void
}

export default memo(Recorder)

function Recorder({ hit, miss, batch, disabled }: Readonly<Props>) {
  return (
    <div className="overflow-hidden">
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
          {/**<div className="bg-muted rounded-lg p-[3px]">
            <Button
              variant="outline"
              className="h-[42px] rounded-md border border-transparent !px-2"
              onClick={() => setShow(!show)}
            >
              <motion.span
                animate={{
                  rotate: show ? 0 : 180
                }}
              >
                <ChevronDown />
              </motion.span>
            </Button>
          </div> */}
        </div>

        <TabsContent value="byPutt" className="flex flex-col gap-2">
          <RecorderSingle hit={hit} miss={miss} disabled={disabled} />
        </TabsContent>
        <TabsContent value="byBatch" className="flex flex-col gap-3">
          <RecorderBatch batch={batch} disabled={disabled} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
