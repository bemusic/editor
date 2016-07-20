import React from 'react'
import ReactDOM from 'react-dom'
import EditorContainer from './EditorContainer'

document.body.style.backgroundColor = '#090807'
document.body.style.color = '#e9e8e7'

const appElement = document.createElement('div')
document.body.appendChild(appElement)

ReactDOM.render(<EditorContainer />, appElement)
