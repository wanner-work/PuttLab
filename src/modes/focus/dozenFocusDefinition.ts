import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

const definition: ModeDefinition = {
  id: 'dozen-focus',
  name: 'Dozen',
  category: 'focus',
  description: 'Dozen focus practice, dozen look that far... init mate?',
  requirements: {
    availableDistance: 12,
    availableTime: 10 * 60,
    allowedPutters: 5
  },
  settings: {
    countdown: false
  },
  steps: [
    {
      label: 'Dozen',
      distance: 12,
      repetitions: 100
    }
  ]
}

export default definition
