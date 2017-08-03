'use strict';
let path = require('path');
let webpack = require('webpack');

let nodeModulesPath = path.resolve(__dirname, 'node_modules');

let entry= {
  index: './src/client/index.js',
  common: [
    'react',
    'react-dom',
    'react-modal',
    'react-router',
    'react-router-redux',
    'react-redux',
    'redux',
    'redux-thunk',
    'echarts',
    'jquery',
    'd3-array',
    'd3-format',
    'd3-time',
    'd3-time-format',
    'moment'
  ]
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
      test: /bootstrap-sass\/assets\/javascripts\//,
      use: 'imports-loader?jQuery=jquery'
    },
    {
      test: /\.(png|jpeg|jpg)/,
      use: [
        'url-loader?limit=8192'
      ]
    },
  ]
};

let resolve = {
  alias: {
    'react': path.join(nodeModulesPath, '/react/dist/react'),
    'react-dom': path.join(nodeModulesPath, '/react-dom/dist/react-dom'),
    'react-modal': path.join(nodeModulesPath, '/react-modal/dist/react-modal'),
    'react-redux': path.join(nodeModulesPath, '/react-redux/dist/react-redux'),
    'react-router': path.join(nodeModulesPath, '/react-router/umd/ReactRouter'),
    'react-router-redux': path.join(nodeModulesPath, '/react-router-redux/dist/ReactRouterRedux'),
    'redux': path.join(nodeModulesPath, '/redux/dist/redux'),
    'redux-thunk': path.join(nodeModulesPath, '/redux-thunk/dist/redux-thunk'),
    'echarts': path.join(nodeModulesPath, '/echarts/dist/echarts'),
    'd3-array': path.join(nodeModulesPath, '/d3-array/build/d3-array'),
    'd3-format': path.join(nodeModulesPath, '/d3-format/build/d3-format'),
    'd3-time': path.join(nodeModulesPath, '/d3-time/build/d3-time'),
    'd3-time-format': path.join(nodeModulesPath, '/d3-time-format/build/d3-time-format'),
    'jquery': path.join(nodeModulesPath, '/jquery/dist/jquery')
  }
};

let plugins = [
  new  webpack.optimize.CommonsChunkPlugin({
    name:"common",
    filename: "common.dist.js"
  })
];

let externals= {
  // 'electron': 'electron'
  // 'react': 'React',
  // 'react-dom': 'ReactDOM',
  // 'redux': 'Redux',
  // 'react-redux': 'ReactRedux',
  // 'echarts': 'echarts',
  // 'moment': 'moment',
  // 'react-router': 'ReactRouter',
  // 'react-router-redux': 'ReactRouterRedux',
  // 'redux-thunk': 'ReduxThunk'
};

module.exports = {
  devtool: "source-map",
  entry: entry,
  output: {
    path: path.join(__dirname, './dist/app/scripts'),
    filename: "[name].entry.js",
    sourceMapFilename: '[file].map',
    publicPath: './scripts/'
  },
  module: module_config,
  externals: externals,
  plugins: plugins,
  resolve: resolve,
  target: 'electron-renderer'
};
