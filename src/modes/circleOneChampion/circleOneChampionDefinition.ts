import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import calculation from '@/modes/circleOneChampion/calculation.ts'
import { TrophyIcon } from 'lucide-react'

const definition: ModeDefinition = {
  id: 'circle-one-champion',
  name: 'Circle One',
  category: 'champion',
  description: 'The official circle one putting challenge.',
  icon: TrophyIcon,
  requirements: {
    availableDistance: 9,
    availableTime: 10,
    allowedPutters: 2,
    additionalInformation:
      'It is advised to mark your distances before starting. This mode needs the following'
  },
  settings: {
    countdown: false,
    infinite: false
  },
  calculateScore: calculation,
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
      label: 'Accuracy Work',
      distance: 7,
      repetitions: 4
    },
    {
      label: 'Distance Work',
      distance: 9,
      repetitions: 4
    },
    {
      label: 'Short Work',
      distance: 5,
      repetitions: 4
    },
    {
      label: 'Quick Extension',
      distance: 9,
      repetitions: 1
    },
    {
      label: 'Quick Extension',
      distance: 7,
      repetitions: 1
    },
    {
      label: 'Quick Extension',
      distance: 5,
      repetitions: 1
    },
    {
      label: 'Quick Extension',
      distance: 9,
      repetitions: 1
    },
    {
      label: 'Champion Distance',
      distance: 9,
      repetitions: 6
    },
    {
      label: 'Champion Medium',
      distance: 7,
      repetitions: 10
    },
    {
      label: 'Champion Short',
      distance: 5,
      repetitions: 10
    }
  ]
}

export default definition
