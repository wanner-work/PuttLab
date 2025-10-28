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
  modeRuns: ModeRun[]
}

export default function DeleteDNFModeRunDrawer({
  open,
  onOpenChange,
  onSuccess,
  modeId,
  modeRuns
}: Props) {
  const { remove, isPending } = useModeRunDeletion(() => {
    QUERY.CLIENT.invalidateQueries({
      queryKey: [QUERY.CACHE_KEYS.MODE_RUN, modeId]
    })
    onSuccess?.()
  })

  const handleDelete = () => {
    remove(modeRuns)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>Delete all DNF mode runs?</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to delete all {modeRuns.length} mode runs
            which you did not finish?{' '}
            <strong>This action cannot be undone.</strong>
          </DrawerDescription>
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
