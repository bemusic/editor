import React from 'react'
import { pure } from 'recompose'

export function SamplerRegionView ({ width, height, hue, children }) {
  return <div
    style={{
      width,
      height,
      borderRadius: 3,
      background: `hsl(${hue},50%,20%)`,
      boxShadow: `inset 0 0 0 1px hsl(${hue},50%,40%)`,
      position: 'relative'
    }}
  >
    {children}
  </div>
}

export const Note = pure(function Note ({ x, y, width, height, hue }) {
  return <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: width,
      height: height,
      background: `linear-gradient(to bottom, hsla(${hue}, 50%, 72%, 0.32), hsl(${hue}, 50%, 72%))`
    }}
  >
  </div>
})

export default SamplerRegionView
