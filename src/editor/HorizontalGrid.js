import React from 'react'
import createPureFunctionalComponent from '../pure-functional-component/createPureFunctionalComponent'

export const HorizontalGrid = createPureFunctionalComponent(({ top }) => (
  <div style={{
    position: 'absolute',
    top, right: 0, height: 1, left: 0,
    background: '#454443'
  }}>
  </div>
))

HorizontalGrid.displayName = 'HorizontalGrid'

HorizontalGrid.propTypes = {
  top: React.PropTypes.number
}

export default HorizontalGrid
