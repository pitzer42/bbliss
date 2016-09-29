module.exports = {
  entry:{
    receiver: './src/receiver.js',
    sender: './src/newStream.js'
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
    extensions: ['', '.js', '.json']
  }
};
