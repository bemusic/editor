import React from 'react'
// import * as EditorState from '../editor-state/EditorState'
import * as EditorViewModel from './EditorViewModel'
import ScrollableArea from '../scrollable-area/ScrollableArea'

// const state = EditorState.initialize({
//   song: require('./example-song')
// })

const VerticalGrid = ({ left }) => (
  <div style={{
    position: 'absolute',
    top: 0, width: 1, left, bottom: 0,
    background: '#454443'
  }}>
  </div>
)

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
    const viewModel = this.selectColumnViewModel()
    return <div style={{ fontSize: 96 }}>
      <div key="vgrid">
        {viewModel.columnGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.columns.map((column, columnIndex) => (
              <VerticalGrid left={column.left} key={columnIndex} />
            ))}
            <VerticalGrid left={group.left + group.width} />
          </div>
        ))}
      </div>
    </div>
  },
  renderOverlay (viewport) {
    const viewModel = this.selectColumnViewModel()
    return <div>
      {viewModel.columnGroups.map((group) => (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: group.left - viewport.left + 1,
            width: group.width - 1,
            background: '#252423',
            borderBottom: '1px solid #454443'
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
