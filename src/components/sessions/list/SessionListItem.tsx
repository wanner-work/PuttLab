import { Card, CardContent } from '@/components/ui/card'
import type { Session } from '@/data/entities/session'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

interface Props {
  index: number
  session: Session
}

export default function SessionListItem({ session }: Props) {
  const percentage = useMemo(() => {
    return calculatePercentage(session.attempts, session.hits)
  }, [session.attempts, session.hits])

  const time = useMemo(() => {
    return dayjs().to(dayjs(session.date))
  }, [session.date])

  return (
    <Link
      to="/sessions/$sessionId"
      viewTransition={{ types: ['slide-left'] }}
      params={{ sessionId: String(session.id) }}
      key={session.id}
      className="active:scale-[0.98]"
    >
      <Card className="py-3">
        <CardContent
          className={clsx('gap-4 px-3', session.attempts > 0 ? 'grid' : 'pl-4')}
          style={{
            gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)'
          }}
        >
          {session.attempts > 0 && (
            <div className="self-center">
              <div
                className="size-10 rotate-90 rounded-full bg-red-50"
                style={{
                  backgroundImage: `conic-gradient(${percentage < 50 && session.attempts >= 20 ? '#3a2336' : '#17134c'} ${100 - percentage}%, #332d90 ${100 - percentage}%)`
                }}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono font-bold uppercase">
                {session.distance} meter
              </p>
              <p className="text-sm text-neutral-400">{time}</p>
            </div>
            {session.attempts > 0 ? (
              <p className="text-muted-foreground pr-2 font-mono font-bold">
                {percentage}%
              </p>
            ) : (
              <ChevronRight className="text-muted-foreground" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
