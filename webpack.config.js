const path = require('path')

module.exports = {
  entry:{
    watchStream: 'controller/watchStream.js',
    createStream: 'controller/createStream.js',
  },
  output: {
    path: './public',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    root: path.resolve('src'),
    extensions: ['', '.js', '.json']
  }
}
