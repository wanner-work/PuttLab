import usePlatform from '@/hooks/capacitor/usePlatform'
import pack from '../../../../package.json'

export default function Version() {
  const platform = usePlatform()

  return (
    <div className="text-muted-foreground text-center text-sm">
      PuttLab for {platform}
      <br /> {pack.version}
    </div>
  )
}
