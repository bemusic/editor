import React from 'react'
import withCustomScrollbar from './withCustomScrollbar'

export const stories = {
  'a custom scrollbar': () => withCustomScrollbar(
    <div
      style={{
        width: 320,
        height: 320,
        overflow: 'auto'
      }}
    >
      <div style={{ fontSize: 1024 }}>{'\u263b'}</div>
    </div>
  )
}
