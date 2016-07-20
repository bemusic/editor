import React from 'react'
// import * as EditorState from '../editor-state/EditorState'
import * as EditorViewModel from './EditorViewModel'
import ScrollableArea from '../scrollable-area/ScrollableArea'

// const state = EditorState.initialize({
//   song: require('./example-song')
// })

export const EditorContainer = React.createClass({
  getInitialState () {
    this.selectColumnViewModel = ((x) => () => x)(
      EditorViewModel.calculateColumnGroupsViewModel(
        EditorViewModel.defaultColumnGroups
      )
    )
    return null
  },
  getWidth () {
    const viewModel = this.selectColumnViewModel()
    return viewModel.width
  },
  getHeight () {
    return 50000
  },
  renderContents () {
    return <div style={{ fontSize: 96 }}>Contents</div>
  },
  renderOverlay (viewport) {
    const viewModel = this.selectColumnViewModel()
    return <div>
      {viewModel.columnGroups.map((group) => (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: group.left - viewport.left,
            width: group.width,
            background: '#252423'
          }}
        >
          {group.title}
        </div>
      ))}
    </div>
  },
  render () {
    return (
      <ScrollableArea
        getWidth={this.getWidth}
        getHeight={this.getHeight}
        renderContents={this.renderContents}
        renderOverlay={this.renderOverlay}
      />
    )
  }
})

export default EditorContainer
