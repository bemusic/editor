import React from 'react'
import * as Viewport from './Viewport'
import withCustomScrollbar from '../custom-scrollbar/withCustomScrollbar'
import shallowCompare from 'react-addons-shallow-compare'

const ScrollableArea = React.createClass({
  propTypes: {
    getHeight: React.PropTypes.func,
    getWidth: React.PropTypes.func,
    renderContents: React.PropTypes.func,
    renderOverlay: React.PropTypes.func
  },
  getInitialState () {
    return { viewport: Viewport.initial }
  },
  componentDidMount () {
    this.updateViewport()
    window.addEventListener('resize', this.updateViewport)
  },
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateViewport)
  },
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },
  updateViewport () {
    if (this.scroller) {
      const viewport = Viewport.fromElement(this.scroller)
      if (!Viewport.equals(this.state.viewport, viewport)) {
        this.setState({ viewport })
      }
    }
  },
  registerScroller (scroller) {
    this.scroller = scroller
  },
  render () {
    const getHeight = this.props.getHeight || (() => 0)
    const getWidth = this.props.getWidth || (() => 0)
    const renderContents = this.props.renderContents || (() => null)
    const renderOverlay = this.props.renderOverlay || (() => null)
    const viewport = this.state.viewport
    return <div
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0
      }}
    >
      {withCustomScrollbar(
        <div
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
            overflow: 'scroll'
          }}
          ref={this.registerScroller}
          onScroll={this.updateViewport}
        >
          <div
            style={{
              position: 'relative',
              height: getHeight(viewport),
              width: getWidth(viewport)
            }}
          >
            {renderContents(viewport)}
          </div>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: 0, right: 8, bottom: 8, left: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {renderOverlay(viewport)}
        </div>
      </div>
    </div>
  }
})

export default ScrollableArea
