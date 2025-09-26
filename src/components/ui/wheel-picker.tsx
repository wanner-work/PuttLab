import '@ncdai/react-wheel-picker/style.css'

import * as WheelPickerPrimitive from '@ncdai/react-wheel-picker'

import { cn } from '@/lib/utils.ts'

type WheelPickerOption = WheelPickerPrimitive.WheelPickerOption
type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames

function WheelPickerWrapper({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        'w-56 rounded-lg border bg-white px-1 shadow-xs dark:bg-black',
        '*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md',
        '*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md',
        className
      )}
      {...props}
    />
  )
}

function WheelPicker({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: 'text-zinc-400 dark:text-zinc-500 text-lg',
        highlightWrapper:
          'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50',
        ...classNames
      }}
      {...props}
    />
  )
}

export { WheelPicker, WheelPickerWrapper }
export type { WheelPickerClassNames, WheelPickerOption }
