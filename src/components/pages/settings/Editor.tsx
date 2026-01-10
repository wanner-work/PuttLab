import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import QUERY from '@/constants/QUERY'
import useSettingsMutation from '@/hooks/data/settings/useSettingsMutation'
import type SettingsData from '@/interfaces/data/SettingsData'

interface Props {
  settings: Partial<SettingsData>
}

export default function Editor({ settings }: Props) {
  const { mutate } = useSettingsMutation()

  const onChange = (setting: Partial<SettingsData>) => {
    mutate({ ...settings, ...setting }, {})

    // optimistically update settings
    QUERY.CLIENT.setQueryData([QUERY.CACHE_KEYS.SETTINGS], {
      ...settings,
      ...setting
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 font-bold">General</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label htmlFor="metric">Metric mode</Label>
            <p className="text-muted-foreground mt-2 text-sm text-pretty">
              Use metric units (meters), instead of freedom units (feet).
            </p>
          </div>
          <Switch
            id="metric"
            checked={settings.metric}
            onCheckedChange={(value) => onChange({ metric: value })}
          />
        </div>
      </div>
      <div>
        <p className="mb-3 font-bold">User Interface</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label htmlFor="intro">Intro animation</Label>
            <p className="text-muted-foreground mt-2 text-sm text-pretty">
              Display the intro animation when launching the app.
            </p>
          </div>
          <Switch
            id="intro"
            checked={settings.intro}
            onCheckedChange={(value) => onChange({ intro: value })}
          />
        </div>
      </div>
    </div>
  )
}
