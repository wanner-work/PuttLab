export default function getFeetFromMeter(meters: number) {
  const exact = meters * 3.28084
  return Math.round(exact)
}
