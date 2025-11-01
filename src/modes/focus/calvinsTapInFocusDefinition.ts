import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

const definition: ModeDefinition = {
  id: 'calvins-tap-in-focus',
  name: "Calvin's Tap in",
  category: 'focus',
  description: "Calvin's Tap in practice, can you bring them heim(burg)?",
  requirements: {
    availableDistance: 15,
    availableTime: 10 * 60,
    allowedPutters: 5
  },
  settings: {
    countdown: false
  },
  steps: [
    {
      label: "Calvin's Tap in",
      distance: 15,
      repetitions: 100
    }
  ]
}

export default definition
