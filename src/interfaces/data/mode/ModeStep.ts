export default interface ModeStep {
  /**
   * The optional label of the step. It will be displayed to the user.
   */
  label?: string

  /**
   * The distance to putt for this step, in meters.
   */
  distance: number

  /**
   * The number of repetitions for this step. The user will have to complete this step the specified number of times before moving on to the next step.
   */
  repetitions: number

  /**
   * Score multiplier for this step. The score achieved in this step will be multiplied by this value.
   *
   * Default is 1.
   */
  scoreMultiplier?: number
}
