import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { List } from 'react-window'
import ModesListItem from './ModesListItem'

interface Props {
  modes: ModeDefinition[]
}

export default function ModesList({ modes }: Props) {
  return (
    <List
      rowComponent={ModesListItem}
      rowCount={modes.length || 0}
      rowHeight={160}
      rowProps={{ modes }}
      overscanCount={5}
    />
  )
}
