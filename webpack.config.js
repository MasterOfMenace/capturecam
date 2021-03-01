const path = require('path');
const miniCss = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',

  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    https: true,
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
        }
      },
      {
        test: /\.(webp|jpe?g|png|gif|svg)$/,
        use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/'
            }
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          miniCss.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new miniCss({
      filename: 'style.css'
    }),
  ],

  devtool: 'source-map',

  optimization: {
    minimize: false
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }
};
