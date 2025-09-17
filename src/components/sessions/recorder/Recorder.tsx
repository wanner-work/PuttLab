import { MoveRight } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, useState } from 'react'
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
  const [show, setShow] = useState(true)

  return (
    <div className="overflow-hidden">
      <Tabs defaultValue="byPutt">
        <div className="flex gap-2">
          <TabsList className="relative h-auto w-full">
            <motion.div
              className="text-muted-foreground absolute left-0 flex h-full w-full items-center justify-between px-4 text-left"
              animate={{
                opacity: show ? 0 : 0.4
              }}
              transition={{
                duration: 0.15
              }}
            >
              Tap here to open controls
              <MoveRight />
            </motion.div>
            <motion.div
              className="w-full"
              animate={{
                opacity: show ? 1 : 0,
                filter: show ? 'blur(0px)' : 'blur(5px)'
              }}
              transition={{
                duration: 0.15
              }}
            >
              <TabsTrigger
                value="byPutt"
                className="w-full p-2"
                disabled={disabled}
              >
                By Putt
              </TabsTrigger>
            </motion.div>
            <motion.div
              className="w-full"
              animate={{
                opacity: show ? 1 : 0,
                filter: show ? 'blur(0px)' : 'blur(5px)'
              }}
              transition={{
                duration: 0.15
              }}
            >
              <TabsTrigger
                value="byBatch"
                className="w-full p-2"
                disabled={disabled}
              >
                By Batch
              </TabsTrigger>
            </motion.div>
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
