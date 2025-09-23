import type SettingsData from '@/interfaces/data/SettingsData'
import updateSettings from '@/methods/data/update/updateSettings'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { Switch } from '../ui/switch'

interface Props {
  initialSettings?: Partial<SettingsData>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function SettingsDrawer({
  initialSettings,
  open,
  onOpenChange,
  onSuccess
}: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      onSuccess?.()
    }
  })

  const form = useForm<SettingsData>({
    defaultValues: initialSettings
  })

  function onSubmit(values: SettingsData) {
    mutate(values)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Define certain settings, to make you feel like home.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-4 mt-4 px-4">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metric"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Metric mode</FormLabel>
                          <FormDescription>
                            Use metric units (meters), instead of freedom units
                            (feet).
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                {isPending && <Loader2Icon className="animate-spin" />}
                Save Settings
              </Button>
            </form>
          </FormProvider>
        </div>
        <DrawerFooter className="mx-4">
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
