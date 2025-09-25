import { Card, CardContent } from '@/components/ui/card'
import ANIMATION from '@/constants/ANIMATION'
import QUERY from '@/constants/QUERY'
import type { Session } from '@/data/entities/session'
import useDragAction from '@/hooks/ui/useDragAction'
import useUnit from '@/hooks/units/useUnit'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronRight, TrashIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Fragment, useMemo, useState } from 'react'
import type { RowComponentProps } from 'react-window'
import DeleteSessionDrawer from '../actions/DeleteSessionDrawer.tsx'

interface Props {
  sessions: Session[]
}

export default function SessionListItem({
  sessions,
  index,
  style
}: RowComponentProps<Props>) {
  const [isDeleted, setIsDeleted] = useState(false)

  const session = sessions[index]

  const percentage = useMemo(() => {
    return calculatePercentage(session.attempts, session.hits)
  }, [session.attempts, session.hits])

  const time = useMemo(() => {
    return dayjs().to(dayjs(session.date))
  }, [session.date])

  const { onDragEnd, onDragStart, xMotionValue, x } = useDragAction({
    actionRight: () => {
      setIsDeleted(true)
    }
  })

  const { getDistance, unit } = useUnit()

  return (
    <Fragment key={session.id}>
      <DeleteSessionDrawer
        open={isDeleted}
        onOpenChange={setIsDeleted}
        onSuccess={async () => {
          setIsDeleted(false)
          await QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          await QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, session.id]
          })
          await QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, session.distance]
          })
        }}
        sessionId={session.id}
        attempts={session.attempts}
      />
      <Link
        to="/sessions/$sessionId"
        viewTransition={{ types: ['slide-left'] }}
        params={{ sessionId: String(session.id) }}
        className="select-none"
        style={style}
      >
        <div className="relative overflow-hidden">
          <motion.div
            className={clsx(
              'absolute top-0 h-[70px] w-full rounded-r-xl',
              (x < 0 || isDeleted) && 'bg-red-500'
            )}
            animate={{
              opacity: `${isDeleted ? 100 : x * -1}%`
            }}
            transition={{
              ease: 'linear',
              duration: 0
            }}
          />
          <div className="absolute top-0 right-0 flex h-[70px] items-center">
            <motion.div
              className="px-5"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: x <= ANIMATION.thresholdLeft || isDeleted ? 1 : 0.7,
                opacity: `${isDeleted ? 100 : x * -1}%`
              }}
              transition={{
                ease: 'linear',
                duration: 0.05
              }}
            >
              <TrashIcon className="text-light h-5 w-5" />
            </motion.div>
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            animate={{
              translateX: isDeleted ? '-100%' : 0
            }}
            transition={{
              ease: 'linear',
              duration: 0.2
            }}
            style={{ x: xMotionValue }}
            className="relative"
          >
            <Card className="py-3">
              <CardContent
                className={clsx(
                  'gap-4 px-3',
                  session.attempts > 0 ? 'grid' : 'pl-4'
                )}
                style={{
                  gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)'
                }}
              >
                {session.attempts > 0 && (
                  <div className="self-center">
                    <div
                      className="size-10 rotate-90 rounded-[20px] bg-red-50"
                      style={{
                        backgroundImage: `conic-gradient(${percentage < 50 && session.attempts >= 20 ? '#3a2336' : '#17134c'} ${100 - percentage}%, #332d90 ${100 - percentage}%)`
                      }}
                    />
                  </div>
                )}
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
          </motion.div>
        </div>
      </Link>
    </Fragment>
  )
}
