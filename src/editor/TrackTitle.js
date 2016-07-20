import React from 'react'

export const TrackTitle = ({ title, left, width }) => (
  <div
    style={{
      position: 'absolute',
      top: 22,
      left: left + 1,
      width: width - 1,
      font: 'bold 12px/18px sans-serif',
      boxSizing: 'border-box',
      color: 'rgba(255,255,255,0.4)',
      textAlign: 'center'
    }}
  >
    {title}
  </div>
)

TrackTitle.propTypes = {
  title: React.PropTypes.string,
  left: React.PropTypes.number,
  width: React.PropTypes.number
}

export default TrackTitle
