import PageContainer from '@/components/basic/PageContainer.tsx'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { memo } from 'react'
import { List } from 'react-window'

import ModeListItem from '@/components/modes/list/ModeListItem.tsx'
import MODES from '@/constants/MODES.ts'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/modes/')({
  component: memo(Modes)
})

function Modes() {
  return (
    <PageContainer
      title="Modes"
      subtitle="Select a mode to play"
      back="/"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, auto) minmax(0, 1fr)'
      }}
      className="grid h-dvh pb-0"
    >
      <div className="overflow-hidden">
        <List
          rowComponent={ModeListItem}
          rowCount={MODES.DEFINITIONS.length}
          rowHeight={160}
          rowProps={{ modes: MODES.DEFINITIONS }}
        />
      </div>
    </PageContainer>
  )
}
