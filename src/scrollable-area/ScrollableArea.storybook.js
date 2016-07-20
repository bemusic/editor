import React from 'react'
import ScrollableArea from './ScrollableArea'

export const stories = {
  'blank': () => (
    <ScrollableArea />
  ),
  'with some objects': (log) => {
    const objects = [ ]
    for (let i = 0; i < 4096; i++) {
      const object = {
        _id: i + 1,
        top: Math.round(Math.random() * 8192),
        left: Math.round(Math.random() * 8192)
      }
      object.element = (
        <div
          key={object._id}
          style={{
            position: 'absolute',
            top: object.top,
            left: object.left,
            width: 25,
            height: 25,
            borderRadius: 25,
            background: 'black'
          }}
        >
        </div>
      )
      objects.push(object)
    }
    function renderChildren (viewport) {
      return [ ...generateChildren(viewport) ]
    }
    function * generateChildren (viewport) {
      for (const object of objects) {
        if (object.left < viewport.left - 100) continue
        if (object.left > viewport.left + viewport.width + 100) continue
        if (object.top < viewport.top - 100) continue
        if (object.top > viewport.top + viewport.height + 100) continue
        yield object.element
      }
    }
    function getWidth (viewport) {
      return 8192
    }
    function getHeight (viewport) {
      return 8192
    }
    function renderOverlay (viewport) {
      return <div>
        <button key="button" style={{ position: 'absolute', bottom: 10, left: 10 }}>
          I am an overlay button
        </button>
      </div>
    }
    return <ScrollableArea
      renderContents={renderChildren}
      renderOverlay={renderOverlay}
      getWidth={getWidth}
      getHeight={getHeight}
    />
  }
}
