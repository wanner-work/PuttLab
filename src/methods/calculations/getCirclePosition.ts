export default function getCirclePosition(distance: number) {
  if (distance <= 3) {
    return 'inside bullseye'
  } else if (distance < 10) {
    return 'inside circle one'
  } else if (distance === 10) {
    return 'circle one edge'
  } else if (distance < 20) {
    return 'inside circle two'
  } else if (distance === 20) {
    return 'circle two edge'
  } else if (distance > 20) {
    return 'outside circle two'
  }
}
