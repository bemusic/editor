import * as EditorState from '../editor-state/EditorState'
import * as Song from '../editor-state/Song'
import * as EditorViewModel from './EditorViewModel'
import * as MusicRegionData from './MusicRegionData'

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import component from '../react-closure'
import HorizontalGrid from './HorizontalGrid'
import SamplerRegionViewContainer from '../sampler-region/SamplerRegionViewContainer'
import ScrollableArea from '../scrollable-area/ScrollableArea'
import TrackGroupTitle from './TrackGroupTitle'
import TrackTitle from './TrackTitle'
import VerticalGrid from './VerticalGrid'

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
  const getWidth = () => columnViewModel.width
  const selectGetHeight = (props) => () => props.height
  const selectGridlines = (props) => props.gridlines
  const selectSong = (props) => props.song
  const selectBeatToTop = (props) => props.beatToTop

  const selectRenderContents = createSelector(
    selectGridlines, selectSong, selectBeatToTop,
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
        getHeight={selectGetHeight(props)}
        renderContents={selectRenderContents(props)}
        renderOverlay={renderOverlay}
      />
    )
  }
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
  return ({ song, columnViewModel, beatToTop, yToBeat }) => {
    const musicRegions = Song.getMusicRegions(song)
    console.log(musicRegions)
    return (
      <div data-type="MusicObjectContainer">
        {musicRegions.map((region, index) => {
          const startTop = beatToTop(yToBeat(region.y))
          const endTop = beatToTop(yToBeat(MusicRegionData.length(region.data)))
          const top = Math.min(startTop, endTop)
          const height = Math.max(startTop, endTop) - top
          if (MusicRegionData.isSamplerRegion(region.data)) {
            return (
              <div style={{ position: 'absolute', top: top }} key={index}>
                <SamplerRegionViewContainer
                  width={60}
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
