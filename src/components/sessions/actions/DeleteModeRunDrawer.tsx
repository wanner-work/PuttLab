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
  modeRun: ModeRun | null
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

  const handleDelete = () => {
    if (!modeRun) return
    remove(modeRun)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>Delete mode run?</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to delete this mode run?{' '}
            <strong>This action cannot be undone.</strong>
          </DrawerDescription>
          <span className="mx-auto max-w-52 text-xs text-neutral-500">
            Btw. deleting a bad run is a legitimate strategy to improve your
            average.
          </span>
        </DrawerHeader>
        <DrawerFooter className="mx-4">
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            Delete
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
