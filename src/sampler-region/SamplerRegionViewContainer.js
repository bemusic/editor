import SamplerRegionView, { Note } from './SamplerRegionView'
import { createSelector } from 'reselect'
import React from 'react'
import * as SamplerRegionViewModel from './SamplerRegionViewModel'

export const SamplerRegionViewContainer = React.createClass({
  propTypes: {
    samplerRegion: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    hue: React.PropTypes.number
  },
  getInitialState () {
    this.selectViewModel = createSelector(
      () => this.props.samplerRegion,
      () => this.props.width,
      () => this.props.height,
      (samplerRegion, width, height) => (
        SamplerRegionViewModel.getViewModel(samplerRegion, width, height)
      )
    )
    this.selectNotes = createSelector(
      () => this.selectViewModel().notes,
      () => this.props.hue,
      (noteViewModels, hue) => noteViewModels.map(note => (
        <Note
          x={note.left}
          y={note.top}
          width={note.width}
          height={note.height}
          hue={hue}
        />
      ))
    )
    return null
  },
  render () {
    const { width, height, hue } = this.props
    return (
      <SamplerRegionView
        width={width}
        height={height}
        hue={hue}
      >
        {this.renderNotes(this.props)}
      </SamplerRegionView>
    )
  }
})

export default SamplerRegionViewContainer
