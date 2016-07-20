import React from 'react'

export function SamplerRegion ({ width, height, hue, children }) {
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

export default SamplerRegion
