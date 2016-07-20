import React from 'react'

export const TrackGroupTitle = ({ title, left, width }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: left + 1,
      width: width - 1,
      background: '#252423',
      borderBottom: '1px solid #454443',
      font: '14px/22px sans-serif',
      paddingLeft: 4,
      boxSizing: 'border-box',
      color: '#8b8685'
    }}
  >
    {title}
  </div>
)

TrackGroupTitle.propTypes = {
  title: React.PropTypes.string,
  left: React.PropTypes.number,
  width: React.PropTypes.number
}

export default TrackGroupTitle
