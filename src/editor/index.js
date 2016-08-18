import React from 'react'
import ReactDOM from 'react-dom'
import EditorContainer from './EditorContainer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer, { SONG_LOADED } from '../editor-state/redux'
import loadExampleSong from './example-song'

document.body.style.backgroundColor = '#090807'
document.body.style.color = '#e9e8e7'

const appElement = document.createElement('div')
document.body.appendChild(appElement)

const store = createStore(
  reducer,
  window.devToolsExtension && window.devToolsExtension()
)

loadExampleSong(function (song) {
  console.log('Loaded example song', song)
  store.dispatch({ type: SONG_LOADED, song })
})

ReactDOM.render(
  <Provider store={store}>
    <EditorContainer />
  </Provider>,
  appElement
)
