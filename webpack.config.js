const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
module.exports = {
    mode: "production",
    entry: './src/index.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build/web')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'staticfile'),
        to: 'staticfile',
      },
      {
        from: './src/detail',
        to: 'detail',
      }
    ])
  ]
  }