import React from 'react'

import createPureFunctionalComponent from '../pure-functional-component/createPureFunctionalComponent'

const TYPE_BG_MAP = {
  bar: '#656463',
  major: '#454443',
  minor: '#353433'
}

export const HorizontalGrid = createPureFunctionalComponent(({ top, type }) => (
  <div style={{
    position: 'absolute',
    top, right: 0, height: 1, left: 0,
    background: TYPE_BG_MAP[type]
  }}>
  </div>
))

HorizontalGrid.displayName = 'HorizontalGrid'

HorizontalGrid.propTypes = {
  top: React.PropTypes.number,
  type: React.PropTypes.string
}

export default HorizontalGrid
