export default interface FilterValue {
  timeframe: 'year' | 'month' | 'day' | 'all'
  /**
   * If timeframe is 'day', format: 'YYYY-MM-DD'
   * If timeframe is 'month', format: 'YYYY-MM'
   * If timeframe is 'year', format: 'YYYY'
   */
  date?: string

  distanceMode: 'dg' | 'unit'
  /**
   * If distanceMode is 'dg', either: bullseye, c1x, c2, outside or all
   * If distanceMode is 'unit', format: string representing metric distance (e.g., "10" for 10 meters)
   */
  distance: string
}
