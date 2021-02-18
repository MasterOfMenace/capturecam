const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    open: false,
    publicPath: '/',
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node-modules/,
        use: {
          loader: 'babel-loader'
        },
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
