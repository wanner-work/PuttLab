import type ModeCalculationParams from '@/interfaces/data/mode/ModeCalculationParams.ts'
import type ModeStep from '@/interfaces/data/mode/ModeStep.ts'
import type { FunctionComponent } from 'react'

export default interface ModeDefinition {
  /**
   * The unique identifier of the mode. It should be a lowercase, kebab-case string without spaces.
   * It will be used in the URL and as a key in the database but will not be displayed to the user.
   */
  id: string

  /**
   * The name of the mode. It will be displayed to the user.
   */
  name: string

  /**
   * The category of the mode. Will be used to group modes in the UI and will maybe separate
   * free modes from paid ones in the future.
   */
  category: 'standard' | 'champion'

  /**
   * A very brief description of the mode.
   */
  description: string

  /**
   * A React component that renders the icon of the mode.
   */
  icon: FunctionComponent<{ className?: string }>

  /**
   * The requirements you need to meet to use this specific mode.
   */
  requirements: {
    /**
     * The minimum distance the user must have available to be able to play this mode, in meters.
     */
    availableDistance: number

    /**
     * The minimum time the user must have available to use this mode, in minutes.
     */
    availableTime: number

    /**
     * The maximum number of putters the user is allowed to use while playing this mode.
     */
    allowedPutters: number

    /**
     * Additional information about the mode that will be displayed to the user.
     */
    additionalInformation: string
  }

  /**
   * Settings specific to this mode.
   */
  settings: {
    /**
     * Whether the mode must be completed in a countdown fashion (true) or can be completed with infinite time (false).
     * If true, the `requirements.availableTime` will be used as the countdown time.
     */
    countdown: boolean
    /**
     * Whether the mode can be played infinitely (true) or not (false).
     * If true, the mode will loop through the steps indefinitely until the user decides to stop or the countdown ends.
     */
    infinite: boolean
  }

  /**
   * Calculation function to determine the score of a session.
   *
   * It receives all the sessions of the mode, the ModeRun object as well as the elapsed time in ms and the entire mode definition.
   * It should return a number representing the score of the session.
   *
   * Cut to 1 decimal place.
   */
  calculateScore: (params: ModeCalculationParams) => number

  /**
   * All the steps that make up this mode.
   */
  steps: ModeStep[]
}
