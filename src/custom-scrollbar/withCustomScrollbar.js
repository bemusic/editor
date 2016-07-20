import cx from 'classnames'
import React from 'react'
import './withCustomScrollbar.css'

export const className = 'with-custom-scrollbar'

export function withCustomScrollbar (element) {
  return React.cloneElement(element, {
    className: cx(element.props.className, className)
  })
}

export default withCustomScrollbar
