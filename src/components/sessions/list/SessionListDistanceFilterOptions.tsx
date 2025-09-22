import { SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select'
import type { Session } from '@/data/entities/session'
import { useMemo } from 'react'

interface Props {
  sessions: Session[]
}

export default function SessionListDistanceFilterOptions({ sessions }: Props) {
  const optionsBullseye = useMemo(() => {
    return sessions
      ?.filter((s) => s.distance <= 3)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [sessions])

  const optionsCircleOne = useMemo(() => {
    return sessions
      ?.filter((s) => s.distance <= 10 && s.distance > 3)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [sessions])

  const optionsCircleTwo = useMemo(() => {
    return sessions
      ?.filter((s) => s.distance <= 20 && s.distance > 10)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [sessions])

  const optionsOutsideCircle = useMemo(() => {
    return sessions
      ?.filter((s) => s.distance > 20)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [sessions])

  return (
    <>
      <SelectGroup>
        <SelectLabel>Bullseye</SelectLabel>
        {optionsBullseye && optionsBullseye.length > 0 ? (
          optionsBullseye.map((distance) => (
            <SelectItem key={distance} value={String(distance)}>
              {distance} meters
            </SelectItem>
          ))
        ) : (
          <SelectItem value="undefined" disabled>
            No sessions with this distance yet
          </SelectItem>
        )}
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Circle 1</SelectLabel>
        {optionsCircleOne && optionsCircleOne.length > 0 ? (
          optionsCircleOne.map((distance) => (
            <SelectItem key={distance} value={String(distance)}>
              {distance} meters
            </SelectItem>
          ))
        ) : (
          <SelectItem value="undefined" disabled>
            No sessions with this distance yet
          </SelectItem>
        )}
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Circle 2</SelectLabel>
        {optionsCircleTwo && optionsCircleTwo.length > 0 ? (
          optionsCircleTwo.map((distance) => (
            <SelectItem key={distance} value={String(distance)}>
              {distance} meters
            </SelectItem>
          ))
        ) : (
          <SelectItem value="undefined" disabled>
            No sessions with this distance yet
          </SelectItem>
        )}
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Outside Circle</SelectLabel>
        {optionsOutsideCircle && optionsOutsideCircle.length > 0 ? (
          optionsOutsideCircle.map((distance) => (
            <SelectItem key={distance} value={String(distance)}>
              {distance} meters
            </SelectItem>
          ))
        ) : (
          <SelectItem value="undefined" disabled>
            No sessions with this distance yet
          </SelectItem>
        )}
      </SelectGroup>
    </>
  )
}
