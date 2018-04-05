'use strict';
const path = require('path');
const webpack = require('webpack');
const CopyWebPackPlugin = require('copy-webpack-plugin');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

let entry= {
  index: './src/client/index.js'
};

let module_config= {
  rules: [
    {
      test: /\.js$/,
      use: [
        "babel-loader"
      ],
      exclude: /node_modules/,
      include: __dirname
    },
    {
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        "less-loader"
      ]
    },
    {
      test: /\.scss/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
    },
    {
      test: /\.css/,
      use: [
        "style-loader",
        "css-loader",
      ]
    },
    {
      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=10000',
    },
    {
      test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
      use: 'file-loader',
    },
    {
      test: /\.(png|jpeg|jpg)/,
      use: [
        'url-loader?limit=8192'
      ]
    },
  ]
};

let plugins = [
  new CopyWebPackPlugin([
    {'from': './src/client/index.html', 'to': '../'}
  ]),
];

let optimization = {
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all"
      }
    }
  }
};

module.exports = {
  devtool: "source-map",
  entry: entry,
  output: {
    path: path.join(__dirname, './dist/app/client/scripts'),
    filename: "[name].entry.js",
    sourceMapFilename: '[file].map',
    publicPath: '/client/scripts'
  },
  module: module_config,
  plugins: plugins,
  optimization:optimization,
  target: 'electron-renderer'
};
