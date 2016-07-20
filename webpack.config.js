'use strict'

const { resolve } = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: './src/editor'
  },
  output: {
    path: resolve(__dirname, 'build', 'assets'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src'),
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  plugins: [
    new HtmlPlugin()
  ]
}
