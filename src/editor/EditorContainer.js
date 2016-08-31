import * as EditorState from '../editor-state/EditorState'
import * as Song from '../editor-state/Song'
import * as EditorViewModel from './EditorViewModel'
import * as MusicRegionData from './MusicRegionData'

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import HorizontalGrid from './HorizontalGrid'
import SamplerRegionViewContainer from '../sampler-region/SamplerRegionViewContainer'
import ScrollableArea from '../scrollable-area/ScrollableArea'
import TrackGroupTitle from './TrackGroupTitle'
import TrackTitle from './TrackTitle'
import VerticalGrid from './VerticalGrid'
import { component, selectProp } from '../react-closure'

const EditorContainer = connect(() => {
  const selectSong = EditorState.song
  const selectSongLengthTicks = _.flow(selectSong, Song.lengthTicks)
  const selectSongLengthBeats = _.flow(selectSong, Song.lengthBeats)
  const selectZoomLevel = EditorState.zoomLevel

  const selectHeight = createSelector(
    selectSongLengthBeats, selectZoomLevel,
    (songLengthBeats, zoomLevel) => {
      const height = EditorViewModel.calculateEditorHeight({
        songLengthBeats,
        zoomLevel
      })
      return height
    }
  )

  const selectBeatToTop = createSelector(
    selectHeight, selectZoomLevel,
    (height, zoomLevel) => EditorViewModel.getBeatToTop({
      zoomLevel,
      editorHeight: height
    })
  )

  const selectGridlines = createSelector(
    selectHeight, selectBeatToTop, selectSongLengthTicks,
    (height, beatToTop, songLengthTicks) => EditorViewModel.calculateGridlines({
      beatToTop,
      yToBeat: Song.yToBeat,
      majorGridline: 240,
      minorGridline: 60,
      songLengthTicks: songLengthTicks
    })
  )

  return (state) => {
    return {
      song: selectSong(state),
      height: selectHeight(state),
      gridlines: selectGridlines(state),
      beatToTop: selectBeatToTop(state)
    }
  }
})(component(() => {
  const columnGroups = EditorViewModel.defaultColumnGroups
  const columnViewModel = EditorViewModel.calculateColumnGroupsViewModel(columnGroups)
  const selectWidth = () => columnViewModel.width

  const selectRenderContents = createSelector(
    selectProp('gridlines'),
    selectProp('song'),
    selectProp('beatToTop'),
    (gridlines, song, beatToTop) => (viewport) => <div>
      <HorizontalGridContainer gridlines={gridlines} viewport={viewport} />
      <VerticalGridContainer viewModel={columnViewModel} />
      <MusicObjectContainer
        columnViewModel={columnViewModel}
        song={song}
        yToBeat={Song.yToBeat}
        beatToTop={beatToTop}
      />
    </div>
  )
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

  const renderOverlay = (viewport) => {
    return <div>
      <div style={{ position: 'absolute', top: 0, left: -viewport.left }}>
        {columns}
      </div>
    </div>
  }

  const selectElement = createSelector(
    selectWidth,
    selectProp('height'),
    selectRenderContents,
    (width, height, renderContents) => {
      const getWidth = () => width
      const getHeight = () => height
      return <ScrollableArea
        getWidth={getWidth}
        getHeight={getHeight}
        renderContents={renderContents}
        renderOverlay={renderOverlay}
      />
    }
  )

  return selectElement
}))

const HorizontalGridContainer = component(() => {
  const BATCH_SIZE = 256
  const selectStartBatchNumber = (props) => (
    Math.floor((props.viewport.top - BATCH_SIZE) / BATCH_SIZE)
  )
  const selectBatchCount = (props) => (
    Math.ceil(props.viewport.height / BATCH_SIZE) + 2
  )
  const selectGridlines = (props) => props.gridlines
  const selectGetBatch = createSelector(
    selectGridlines,
    (gridlines) => _.memoize((batchNumber) => {
      const begin = BATCH_SIZE * batchNumber
      const end = BATCH_SIZE * (batchNumber + 1)
      const beginIndex = _.sortedIndexBy(gridlines, { top: begin }, 'top')
      const endIndex = _.sortedIndexBy(gridlines, { top: end }, 'top')
      return <div key={batchNumber} data-horizontal-grid-batch-number={batchNumber}>
        {gridlines.slice(beginIndex, endIndex).map((line) =>
          <HorizontalGrid top={line.top} key={line.top} type={line.type} />
        )}
      </div>
    })
  )
  const selectVisibleBatches = createSelector(
    selectStartBatchNumber, selectBatchCount, selectGetBatch,
    (start, count, getBatch) => {
      const out = [ ]
      for (let i = start; i <= start + count; i++) out.push(getBatch(i))
      return out
    }
  )
  return (props) => {
    return <div>
      {selectVisibleBatches(props)}
    </div>
  }
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

const MusicObjectContainer = component(() => {
  const selectColumnMapping = createSelector(
    selectProp('columnViewModel'),
    (columnViewModel) => {
      const columns = _.flatten(_.map(columnViewModel.columnGroups, 'columns'))
      const musicColumns = _.filter(columns, { info: { type: 'music' } })
      const mapping = _.keyBy(musicColumns, 'info.track')
      return (track) => {
        const found = mapping[track]
        if (found) {
          return mapping[track]
        } else {
          return null
        }
      }
    }
  )
  return (props) => {
    const { song, beatToTop, yToBeat } = props
    const musicRegions = Song.getMusicRegions(song)
    const columnMapping = selectColumnMapping(props)
    return (
      <div data-type="MusicObjectContainer">
        {musicRegions.map((region, index) => {
          const column = columnMapping(region.track)
          if (!column) return null
          const startTop = beatToTop(yToBeat(region.y)) + 1
          const endTop = beatToTop(yToBeat(region.y + MusicRegionData.length(region.data))) + 1
          const top = Math.min(startTop, endTop)
          const height = Math.max(startTop, endTop) - top
          const { left, width } = column
          if (MusicRegionData.isSamplerRegion(region.data)) {
            return (
              <div style={{ position: 'absolute', top, left: left + 1 }} key={region.id}>
                <SamplerRegionViewContainer
                  width={width - 1}
                  height={height}
                  hue={0}
                  samplerRegion={MusicRegionData.getSamplerRegion(region.data)}
                />
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
    )
  }
})

export default EditorContainer
