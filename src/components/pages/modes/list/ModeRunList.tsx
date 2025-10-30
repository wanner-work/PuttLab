import DeleteModeRunDrawer from '@/components/sessions/actions/DeleteModeRunDrawer'
import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { motion } from 'motion/react'
import { useState } from 'react'
import { List } from 'react-window'
import ModeRunListItem from './ModeRunListItem'

interface Props {
  wasLoaded?: boolean
  modeRuns: ModeRun[]
  mode: ModeDefinition
}

export default function ModeRunList({ modeRuns, mode, wasLoaded }: Props) {
  const [modeRunToDelete, setModeRunToDelete] = useState<ModeRun | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setModeRunToDelete(null)
    }
  }

  return (
    <motion.div
      initial={{
        opacity: wasLoaded ? 0 : 1,
        clipPath: wasLoaded ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)'
      }}
      animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <DeleteModeRunDrawer
        open={!!modeRunToDelete}
        onOpenChange={handleOpenChange}
        onSuccess={() => setModeRunToDelete(null)}
        modeId={mode.id}
        modeRun={modeRunToDelete}
      />
      <List
        rowComponent={ModeRunListItem}
        rowCount={modeRuns.length || 0}
        rowHeight={(index) => (index === modeRuns.length - 1 ? 120 : 86)}
        rowProps={{ modeRuns, mode, onModeRunDelete: setModeRunToDelete }}
        overscanCount={5}
      />
    </motion.div>
  )
}
