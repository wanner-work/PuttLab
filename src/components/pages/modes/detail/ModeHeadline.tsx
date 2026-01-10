import ModeTag from '@/components/pages/modes/detail/ModeTag.tsx'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

interface Props {
  mode: ModeDefinition
}

export default function ModeHeadline({ mode }: Readonly<Props>) {
  return (
    <div className="mt-20 mb-20 text-center">
      <ModeTag mode={mode.category} className="mb-4" />
      <h1 className="text-4xl font-bold">{mode.name}</h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-[200px] text-lg">
        {mode.description}
      </p>
    </div>
  )
}
