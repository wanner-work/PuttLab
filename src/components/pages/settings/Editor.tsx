import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import useSettingsMutate from '@/hooks/data/settings/useSettingsMutate'
import type SettingsData from '@/interfaces/data/SettingsData'
import { FormProvider, useForm } from 'react-hook-form'

interface Props {
  settings: Partial<SettingsData>
}

export default function Editor({ settings }: Props) {
  const { mutate } = useSettingsMutate()

  const form = useForm<SettingsData>({
    defaultValues: settings
  })

  function onSubmit(values: SettingsData) {
    mutate(values)
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <p className="mb-3 font-bold">General</p>
        <FormField
          control={form.control}
          name="metric"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-3">
              <div>
                <FormLabel>Metric mode</FormLabel>
                <FormDescription className="text-pretty">
                  Use metric units (meters), instead of freedom units (feet).
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
        <p className="mb-3 font-bold">User Interface</p>
        <FormField
          control={form.control}
          name="intro"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-3">
              <div>
                <FormLabel>Show the intro animation</FormLabel>
                <FormDescription className="text-pretty">
                  Display the intro animation when launching the app.
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
      </form>
    </FormProvider>
  )
}
