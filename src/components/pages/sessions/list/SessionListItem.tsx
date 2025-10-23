import { Card, CardContent } from '@/components/ui/card'
import type { Session } from '@/data/entities/session'
import useUnit from '@/hooks/units/useUnit'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Check, ChevronRight, Ellipsis, InfinityIcon } from 'lucide-react'
import { useMemo } from 'react'
import type { RowComponentProps } from 'react-window'

interface Props {
  sessions: Session[]
}

export default function SessionListItem({
  sessions,
  index,
  style
}: RowComponentProps<Props>) {
  const session = sessions[index]

  const percentage = useMemo(() => {
    return calculatePercentage(session.attempts, session.hits)
  }, [session.attempts, session.hits])

  const time = useMemo(() => {
    return dayjs().to(dayjs(session.date))
  }, [session.date])

  const { getDistance, unit } = useUnit()

  const { icon: Icon, className } = useMemo(() => {
    if (session.maxAttempts > 0) {
      if (session.maxAttempts > session.attempts) {
        return {
          icon: Ellipsis,
          className: 'text-yellow-500 bg-yellow-300/20'
        }
      } else if (session.maxAttempts <= session.attempts) {
        return { icon: Check, className: 'text-green-500 bg-green-300/20' }
      }
    }

    return {
      icon: InfinityIcon,
      className: 'text-neutral-300 bg-neutral-300/20'
    }
  }, [session])

  return (
    <Link
      key={session.id}
      to="/improved/sessions/$sessionId"
      viewTransition={{ types: ['slide-left'] }}
      params={{ sessionId: String(session.id) }}
      className="select-none"
      style={style}
    >
      <Card className="py-3">
        <CardContent
          className={clsx('grid gap-4 px-3')}
          style={{
            gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)'
          }}
        >
          <div className="relative self-center">
            <div
              className={clsx(
                'size-10 rotate-90 rounded-[20px]',
                percentage > 0 && 'bg-red-50',
                session.attempts === 0 && '!bg-neutral-500/20'
              )}
              style={{
                backgroundImage:
                  session.attempts > 0
                    ? `conic-gradient(${percentage < 50 && session.attempts >= 20 ? '#3a2336' : '#17134c'} ${100 - percentage}%, #332d90 ${100 - percentage}%)`
                    : 'none'
              }}
            />

            <div
              className={clsx(
                'absolute right-0 bottom-0 flex size-4 translate-x-2 items-center justify-center rounded-full',
                className
              )}
            >
              <Icon className="size-3" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="shrink-0">
              <p className="font-mono font-bold uppercase">
                {getDistance(session.distance)} {unit}
              </p>
              <p className="text-sm text-neutral-400">{time}</p>
            </div>
            {session.attempts > 0 ? (
              <p className="text-muted-foreground pr-2 text-right font-mono text-sm leading-5 font-bold">
                {session.attempts} ATT / {percentage}%
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
