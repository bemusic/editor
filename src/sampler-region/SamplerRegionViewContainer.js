import * as SamplerRegionViewModel from './SamplerRegionViewModel'

import React from 'react'
import { createSelector } from 'reselect'

import SamplerRegionView, { Note } from './SamplerRegionView'
import { component, selectProp } from '../react-closure'

export const SamplerRegionViewContainer = component(() => {
  const selectViewModel = createSelector(
    selectProp('samplerRegion'),
    selectProp('width'),
    selectProp('height'),
    (samplerRegion, width, height) => (
      SamplerRegionViewModel.getViewModel(samplerRegion, { width, height })
    )
  )
  const selectNotes = createSelector(
    selectProp('hue'),
    selectViewModel,
    (hue, viewModel) => viewModel.notes.map((note, index) => (
      <Note
        x={note.left}
        y={note.top}
        width={note.width}
        height={note.height}
        hue={hue}
        key={index}
      />
    ))
  )
  const selectView = createSelector(
    selectProp('width'),
    selectProp('height'),
    selectProp('hue'),
    selectNotes,
    (width, height, hue, notes) => (
      <SamplerRegionView
        width={width}
        height={height}
        hue={hue}
      >
        {notes}
      </SamplerRegionView>
    )
  )
  return selectView
})

export default SamplerRegionViewContainer
