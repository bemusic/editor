import * as Song from './Song'
import u from 'updeep'

// -- Initializers --

export const initialize = ({ song = Song.empty } = { }) => {
  return {
    song,
    view: { zoom: 1 }
  }
}

// -- Queries --

export const song = (state) => state.song
export const zoomLevel = (state) => state.view.zoom

// -- State updaters --

export const loadSong = (song) => u({ song: () => song })
