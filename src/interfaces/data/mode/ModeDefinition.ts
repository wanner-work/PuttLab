import type ModeStep from '@/interfaces/data/mode/ModeStep.ts'

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
  category: 'standard' | 'champion' | 'focus'

  /**
   * A very brief description of the mode.
   */
  description: string

  /**
   * An optional description of the total distance covered in this mode.
   */
  distanceDescription?: {
    /**
     * A description of the distance in plain words.
     * E.g. C1X or something similar.
     */
    words?: string

    /**
     * The distance in meters.
     * Will be formatted to the user's locale.
     */
    meters?: number
  }

  /**
   * The requirements you need to meet to use this specific mode.
   */
  requirements: {
    /**
     * The minimum distance the user must have available to be able to play this mode, in meters.
     */
    availableDistance: number

    /**
     * The minimum time the user must have available to use this mode, in seconds.
     * If `settings.countdown` is true, this will be used as the countdown time.
     */
    availableTime: number

    /**
     * Additional information about the mode that will be displayed to the user.
     */
    additionalInformation?: string
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
  }

  /**
   * All the steps that make up this mode.
   */
  steps: ModeStep[]
}
