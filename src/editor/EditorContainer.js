import React from 'react'
import * as EditorViewModel from './EditorViewModel'
import * as EditorState from '../editor-state/EditorState'
import * as Song from '../editor-state/Song'
import ScrollableArea from '../scrollable-area/ScrollableArea'
import component from '../react-closure'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import _ from 'lodash'

import VerticalGrid from './VerticalGrid'
import HorizontalGrid from './HorizontalGrid'
import TrackGroupTitle from './TrackGroupTitle'
import TrackTitle from './TrackTitle'

const EditorContainer = connect(() => {
  const selectSongLength = _.flow(EditorState.song, Song.length)
  const selectZoomLevel = EditorState.zoomLevel

  const selectGetHeight = createSelector(
    selectSongLength, selectZoomLevel,
    (songLength, zoomLevel) => {
      const height = EditorViewModel.calculateEditorHeight({ songLength, zoomLevel })
      return () => height
    }
  )

  return (state) => {
    return {
      getHeight: selectGetHeight(state)
    }
  }
})(component(() => {
  const columnGroups = EditorViewModel.defaultColumnGroups
  const columnViewModel = EditorViewModel.calculateColumnGroupsViewModel(columnGroups)
  const getWidth = () => columnViewModel.width

  function renderContents () {
    return <div>
      <HorizontalGridContainer />
      <VerticalGridContainer viewModel={columnViewModel} />
    </div>
  }

  const columns = columnViewModel.columnGroups.map((group, groupIndex) => (
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
          key={columnIndex}
        />
      ))}
    </div>
  ))

  function renderOverlay (viewport) {
    return <div>
      <div style={{ position: 'absolute', top: 0, left: -viewport.left }}>
        {columns}
      </div>
    </div>
  }

  return (props) => {
    return (
      <ScrollableArea
        getWidth={getWidth}
        getHeight={props.getHeight}
        renderContents={renderContents}
        renderOverlay={renderOverlay}
      />
    )
  }
}))

const HorizontalGridContainer = component(() => {
  const element = (
    <div>
      {[ ...(function * () {
        for (let i = 0; i <= 3600; i += 120) {
          yield (<HorizontalGrid top={i} key={i} />)
        }
      }()) ]}
    </div>
  )
  return () => element
})

const VerticalGridContainer = component(() => {
  return _.once(({ viewModel }) => {
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
  })
})

export default EditorContainer
