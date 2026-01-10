import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

const definition: ModeDefinition = {
  id: 'circle-one-champion',
  name: 'Circle One',
  category: 'champion',
  description: 'The official circle one putting challenge.',
  distanceDescription: {
    words: 'C1X'
  },
  requirements: {
    availableDistance: 9,
    availableTime: 8 * 60
  },
  settings: {
    countdown: false
  },
  steps: [
    {
      label: 'Short Warm Up',
      distance: 5,
      repetitions: 4
    },
    {
      label: 'Medium Warm Up',
      distance: 7,
      repetitions: 4
    },
    {
      label: 'Distance Warm Up',
      distance: 9,
      repetitions: 4
    },
    {
      label: 'Short Work',
      distance: 5,
      repetitions: 6
    },
    {
      label: 'Medium Work',
      distance: 7,
      repetitions: 6,
      scoreMultiplier: 2
    },
    {
      label: 'Distance Work',
      distance: 9,
      repetitions: 6,
      scoreMultiplier: 3
    },
    {
      label: 'Champion Short',
      distance: 5,
      repetitions: 2,
      scoreMultiplier: 3
    },
    {
      label: 'Champion Medium',
      distance: 7,
      repetitions: 2,
      scoreMultiplier: 4
    },
    {
      label: 'Champion Distance',
      distance: 9,
      repetitions: 2,
      scoreMultiplier: 5
    }
  ]
}

export default definition
