const { resolve } = require('path')

module.exports = [
  {
    test: /\.js$/,
    include: resolve(__dirname, '..', 'src'),
    loader: 'babel'
  },
  {
    test: /\.css$/,
    loader: 'style!css'
  }
]
