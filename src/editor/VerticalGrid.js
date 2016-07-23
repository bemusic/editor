import React from 'react'
import createPureFunctionalComponent from '../pure-functional-component/createPureFunctionalComponent'

export const VerticalGrid = createPureFunctionalComponent(({ left }) => (
  <div style={{
    position: 'absolute',
    top: 0, width: 1, left, bottom: 0,
    background: '#656463'
  }}>
  </div>
))

VerticalGrid.displayName = 'VerticalGrid'

VerticalGrid.propTypes = {
  left: React.PropTypes.number
}

export default VerticalGrid
