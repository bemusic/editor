import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'

export function createPureFunctionalComponent (renderFunction) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.state = null
    }
    shouldComponentUpdate (nextProps) {
      return shallowCompare(this, nextProps, null)
    }
    render () {
      return renderFunction(this.props)
    }
  }
}

export default createPureFunctionalComponent
