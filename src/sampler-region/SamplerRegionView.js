import React from 'react'

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

export function Note ({ x, y, width, height, hue }) {
  return <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: width,
      height: height,
      background: `hsl(${hue}, 50%, 72%)`
    }}
  >
  </div>
}

export default SamplerRegionView
