module.exports = {
  entry:{
    //main: './src/main.js',
    newStream: './src/newStream.js'
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
