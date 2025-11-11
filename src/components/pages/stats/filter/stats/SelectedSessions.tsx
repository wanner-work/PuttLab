import { Card, CardContent } from '@/components/ui/card.tsx'
import type { Session } from '@/data/entities/session.ts'

interface Props {
  isLoading?: boolean
  sessions?: Session[] | null
}

export default function SelectedSessions({
  isLoading,
  sessions
}: Readonly<Props>) {
  return (
    <Card>
      <CardContent>
        {isLoading
          ? 'Loading...'
          : `${sessions?.length ?? 0} session(s) selected`}
      </CardContent>
    </Card>
  )
}
