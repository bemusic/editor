import * as Song from './Song'

// -- Initializers --

export const initialize = ({ song = Song.empty } = { }) => {
  return {
    song,
    view: { zoom: 1 }
  }
}
