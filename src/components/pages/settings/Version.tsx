import SeedDrawer from '@/components/seed/SeedDrawer.tsx'
import usePlatform from '@/hooks/capacitor/usePlatform'
import { useEffect, useState } from 'react'
import pack from '../../../../package.json'

export default function Version() {
  const platform = usePlatform()

  const [clicks, setClicks] = useState(0)
  const [open, setOpen] = useState(false)

  const click = () => {
    setClicks((prev) => {
      const newClicks = prev + 1
      if (newClicks >= 10) {
        setOpen(true)
      }
      return newClicks
    })
  }

  useEffect(() => {
    setClicks(0)
  }, [open])

  return (
    <>
      <button
        className="text-muted-foreground text-center text-sm"
        onClick={click}
      >
        PuttLab for {platform}
        <br /> {pack.version}
        {clicks > 4 && (
          <>
            <br />
            <span className="text-xs uppercase">
              {10 - clicks} more clicks till dev options
            </span>
          </>
        )}
      </button>

      <SeedDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
