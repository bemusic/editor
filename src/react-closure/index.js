import React from 'react'

export function component (initialize) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this._render = initialize((f) => (...args) => f(this.props)(...args))
    }
    render () {
      return this._render(this.props)
    }
  }
}

export default component
