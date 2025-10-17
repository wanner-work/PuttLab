import type ModeDefinition from '@/interfaces/data/ModeDefinition.ts'
import Introduction from '@/modes/circleOneChampion/Introduction.tsx'
import Result from '@/modes/circleOneChampion/Result.tsx'
import { ApertureIcon } from 'lucide-react'

const definition: ModeDefinition = {
  id: 'circle-one',
  name: 'Circle One',
  icon: ApertureIcon,
  requirements: {
    availableDistance: 9,
    availableTime: 15 * 60 * 1000, // 15 minutes
    availablePutters: 1
  },
  settings: {
    countdown: false,
    infinite: false
  },
  introduction: Introduction,
  result: Result,
  steps: [
    {
      label: 'Short Warm Up',
      distance: 5,
      repetitions: 6
    },
    {
      label: 'Medium Warm Up',
      distance: 7,
      repetitions: 6
    },
    {
      label: 'Distance Warm Up',
      distance: 9,
      repetitions: 6
    },
    {
      label: 'Accuracy Work',
      distance: 7,
      repetitions: 10
    },
    {
      label: 'Distance Work',
      distance: 9,
      repetitions: 10
    },
    {
      label: 'Short Work',
      distance: 5,
      repetitions: 10
    },
    {
      label: 'Quick Extension',
      distance: 4,
      repetitions: 1
    },
    {
      label: 'Quick Extension',
      distance: 6,
      repetitions: 1
    },
    {
      label: 'Quick Extension',
      distance: 8,
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
