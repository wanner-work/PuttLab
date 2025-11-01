import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

const definition: ModeDefinition = {
  id: 'circle-two-champion',
  name: 'Circle Two',
  category: 'champion',
  description: 'The official circle two putting challenge.',
  requirements: {
    availableDistance: 18,
    availableTime: 8 * 60,
    allowedPutters: 2
  },
  settings: {
    countdown: false
  },
  steps: [
    {
      label: 'Short Warm Up',
      distance: 10,
      repetitions: 4
    },
    {
      label: 'Medium Warm Up',
      distance: 14,
      repetitions: 4
    },
    {
      label: 'Distance Warm Up',
      distance: 18,
      repetitions: 4
    },
    {
      label: 'Short Work',
      distance: 10,
      repetitions: 6
    },
    {
      label: 'Medium Work',
      distance: 14,
      repetitions: 6,
      scoreMultiplier: 2
    },
    {
      label: 'Distance Work',
      distance: 18,
      repetitions: 6,
      scoreMultiplier: 3
    },
    {
      label: 'Champion Short',
      distance: 10,
      repetitions: 2,
      scoreMultiplier: 3
    },
    {
      label: 'Champion Medium',
      distance: 14,
      repetitions: 2,
      scoreMultiplier: 4
    },
    {
      label: 'Champion Distance',
      distance: 18,
      repetitions: 2,
      scoreMultiplier: 5
    }
  ]
}

export default definition
