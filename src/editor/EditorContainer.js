import React from 'react'
import * as EditorState from '../editor-state/EditorState'
import ScrollableArea from '../scrollable-area/ScrollableArea'

const state = EditorState.initialize({
  song: require('./example-song')
})

export class EditorContainer extends React.Component {
  render () {
    return (
      <ScrollableArea
      />
    )
  }
}

export default EditorContainer
