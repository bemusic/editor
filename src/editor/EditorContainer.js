import React from 'react'
// import * as EditorState from '../editor-state/EditorState'
import * as EditorViewModel from './EditorViewModel'
import ScrollableArea from '../scrollable-area/ScrollableArea'

// const state = EditorState.initialize({
//   song: require('./example-song')
// })
import VerticalGrid from './VerticalGrid'
import HorizontalGrid from './HorizontalGrid'
import TrackGroupTitle from './TrackGroupTitle'
import TrackTitle from './TrackTitle'

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
    return 3600
  },
  renderContents () {
    const viewModel = this.selectColumnViewModel()
    return <div style={{ fontSize: 96 }}>
      <HorizontalGridContainer />
      <VerticalGridContainer viewModel={viewModel} />
    </div>
  },
  renderOverlay (viewport) {
    const viewModel = this.selectColumnViewModel()
    return <div>
      <div style={{ position: 'absolute', top: 0, left: -viewport.left }}>
        {viewModel.columnGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <TrackGroupTitle
              left={group.left}
              width={group.width}
              title={group.title}
            />
            {group.columns.map((column, columnIndex) => (
              <TrackTitle
                left={column.left}
                width={column.width}
                title={column.title}
              />
            ))}
          </div>
        ))}
      </div>
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

const HorizontalGridContainer = React.createClass({
  shouldComponentUpdate () {
    return false // TODO
  },
  render () {
    return (
      <div>
        {[ ...(function * () {
          for (let i = 0; i <= 3600; i += 120) {
            yield (<HorizontalGrid top={i} />)
          }
        }()) ]}
      </div>
    )
  }
})

const VerticalGridContainer = React.createClass({
  propTypes: {
    viewModel: React.PropTypes.object
  },
  shouldComponentUpdate () {
    return false // TODO
  },
  render () {
    const viewModel = this.props.viewModel
    return (
      <div>
        {viewModel.columnGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.columns.map((column, columnIndex) => (
              <VerticalGrid left={column.left} key={columnIndex} />
            ))}
            <VerticalGrid left={group.left + group.width} />
          </div>
        ))}
      </div>
    )
  }
})

export default EditorContainer
