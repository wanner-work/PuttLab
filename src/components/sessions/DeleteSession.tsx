import QUERY from '@/constants/QUERY'
import deleteSession from '@/methods/data/delete/deleteSession'
import { useMutation } from '@tanstack/react-query'
import type { UseNavigateResult } from '@tanstack/react-router'
import { Loader2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../ui/drawer'

interface Props {
  sessionId: number
  attempts: number
  navigate: UseNavigateResult<string>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeleteSession({
  open,
  onOpenChange,
  navigate,
  sessionId,
  attempts
}: Props) {
  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void navigate({
        to: '/sessions',
        viewTransition: { types: ['slide-right'] }
      })
    }
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete this session?</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to delete this session?{' '}
            {attempts > 0 && `All ${attempts} recorded attempts will be lost.`}{' '}
            <strong>This action cannot be undone.</strong>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="mx-4">
          <Button
            onClick={() => remove(sessionId)}
            disabled={isRemoving}
            variant="destructive"
          >
            {isRemoving && <Loader2Icon className="animate-spin" />}
            Delete
          </Button>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
