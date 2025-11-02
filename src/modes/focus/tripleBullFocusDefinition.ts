import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

const definition: ModeDefinition = {
  id: 'triple-bull-focus',
  name: 'Triple Bull',
  category: 'focus',
  description: 'Triple bull practice, its only three times the bullseye.',
  distanceDescription: {
    meters: 10
  },
  requirements: {
    availableDistance: 10,
    availableTime: 10 * 60,
    allowedPutters: 5
  },
  settings: {
    countdown: false
  },
  steps: [
    {
      label: 'Triple Bull',
      distance: 10,
      repetitions: 100
    }
  ]
}

export default definition
