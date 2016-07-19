
export const initial = { left: 0, top: 0, width: 0, height: 0 }

export const fromElement = (element) => {
  const left = element.scrollLeft
  const top = element.scrollTop
  const width = element.offsetWidth
  const height = element.offsetHeight
  return { left, top, width, height }
}

export function equals (a, b) {
  if (a.left !== b.left) return false
  if (a.top !== b.top) return false
  if (a.width !== b.width) return false
  if (a.height !== b.height) return false
  return true
}
