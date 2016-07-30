import React from 'react'
import SamplerRegionView, { Note } from './SamplerRegionView'

export const stories = {
  'sampler region': () => (
    <SamplerRegionView
      width={64}
      hue={64}
      height={180}
    >
      {renderNotes()}
    </SamplerRegionView>
  )
}

function renderNotes () {
  const notes = [
    { x: 4, y: 0, height: 45 },
    { x: 24, y: 45, height: 45 },
    { x: 34, y: 90, height: 45 },
    { x: 52, y: 135, height: 45 }
  ]
  return notes.map(note => (
    <Note
      x={note.x}
      y={note.y}
      width={8}
      height={note.height}
      hue={64}
    />
  ))
}
