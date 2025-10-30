import QUERY from '@/constants/QUERY.ts'
import type { ModeRun } from '@/data/entities/moderun.ts'
import useModeRunDeletion from '@/hooks/data/mode/useModeRunDeletion.ts'
import type DrawerProps from '@/interfaces/ui/drawer/DrawerProps.ts'
import { Loader2Icon } from 'lucide-react'
import { Button } from '../../ui/button.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../../ui/drawer.tsx'

interface Props extends DrawerProps {
  modeId: string
  modeRun: ModeRun
}

export default function DeleteModeRunDrawer({
  open,
  onOpenChange,
  onSuccess,
  modeId,
  modeRun
}: Props) {
  const { remove, isPending } = useModeRunDeletion(() => {
    QUERY.CLIENT.invalidateQueries({
      queryKey: [QUERY.CACHE_KEYS.MODE_RUN, modeId]
    })
    onSuccess?.()
  })

  const handleAbort = () => {
    remove(modeRun)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>Abort the current run?</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to abort this mode run?{' '}
            <strong>You will not be able to resume it later.</strong>
          </DrawerDescription>
          <span className="mx-auto max-w-52 text-xs text-neutral-500">
            Btw. aborting a bad run is a legitimate strategy to improve your
            average.
          </span>
        </DrawerHeader>
        <DrawerFooter className="mx-4">
          <Button
            onClick={handleAbort}
            disabled={isPending}
            variant="destructive"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            Abort
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
