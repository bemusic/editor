import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import loadExampleSong from './example-song'
import EditorContainer from './EditorContainer'
import reducer, { SONG_LOADED } from '../editor-state/redux'

function createFPSReporter () {
  let buffer = [ ]
  let queued = false
  const element = document.createElement('div')
  element.setAttribute('style', `
    position: fixed; bottom: 0; left: 0; background: black;
    color: green; padding: 3px; font: 12px sans-serif;
  `)
  document.body.appendChild(element)
  function flush () {
    queued = false
    const threshold = Date.now() - 5000
    buffer = buffer.filter((x) => x.time >= threshold)
    const average = buffer.map((x) => x.elapsed).reduce((a, b) => a + b, 0) / buffer.length
    const fps = 1000 / average
    element.innerHTML = Math.round(fps) + 'fps'
  }
  return function report (elapsed) {
    buffer.push({ time: Date.now(), elapsed })
    if (queued) return
    queued = true
    window.requestAnimationFrame(flush)
  }
}

// Hack ReactReconciler to be able to report us the framerate.
void (function () {
  const reporter = createFPSReporter()
  const ReactReconciler = require('react/lib/ReactReconciler')
  let count = 0
  const profile = (original) => function () {
    count++
    if (updating) {
      return original.apply(this, arguments)
    }
    updating = true
    const start = window.performance.now()
    try {
      return original.apply(this, arguments)
    } finally {
      const finish = window.performance.now()
      const elapsed = finish - start
      const fps = 1000 / elapsed
      reporter(elapsed)
      console.log('%s ms (%s fps, %s elements)', ~~elapsed, ~~fps, count)
      updating = false
      count = 0
    }
  }
  let updating = false
  ReactReconciler.mountComponent = profile(ReactReconciler.mountComponent)
  ReactReconciler.receiveComponent = profile(ReactReconciler.receiveComponent)
  ReactReconciler.unmountComponent = profile(ReactReconciler.unmountComponent)
})()

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
