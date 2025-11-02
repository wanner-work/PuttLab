import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

const definition: ModeDefinition = {
  id: 'tap-in-focus',
  name: 'Tap in',
  category: 'focus',
  description: 'Tap-In practice, can you handle the nerves?',
  distanceDescription: {
    meters: 7
  },
  requirements: {
    availableDistance: 7,
    availableTime: 10 * 60,
    allowedPutters: 5
  },
  settings: {
    countdown: false
  },
  steps: [
    {
      label: 'Tap in',
      distance: 7,
      repetitions: 100
    }
  ]
}

export default definition
