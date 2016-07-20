import React from 'react'

export function SamplerRegionNote ({ x, y, width, height, hue }) {
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

export default SamplerRegionNote
