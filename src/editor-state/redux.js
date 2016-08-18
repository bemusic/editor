import * as EditorState from './EditorState'

export const SONG_LOADED = 'SONG_LOADED'

export function reducer (state = EditorState.initialize(), action) {
  switch (action.type) {
    case SONG_LOADED:
      return EditorState.loadSong(action.song)(state)
    default:
      return state
  }
}

export default reducer
