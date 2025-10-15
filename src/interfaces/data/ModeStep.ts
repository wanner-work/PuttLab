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
   * The optional time allocated for this step, in seconds. If the mode is not a countdown mode, this value will be ignored.
   */
  time?: number

  /**
   * The number of repetitions for this step. The user will have to complete this step the specified number of times before moving on to the next step.
   */
  repetitions: number

  /**
   * The optional number of putters allocated for this step. If not specified, it will default to 1.
   */
  batchSize?: number
}
