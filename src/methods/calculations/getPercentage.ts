export default function getPercentage(attempts: number, hits: number) {
  if (attempts === 0) return 0
  return Math.round((hits / attempts) * 100)
}
