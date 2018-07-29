const path = require('path');
const webpack = require('webpack');
const GASWebpackPlugin = require('gas-webpack-plugin');

/** @type {webpack.Configuration} */
const config = {
  mode: 'development',
  devtool: false,
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  plugins: [new GASWebpackPlugin()],
};

module.exports = config;
