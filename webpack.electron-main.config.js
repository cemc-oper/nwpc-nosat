var path = require('path');
var webpack = require('webpack');
var CopyWebPackPlugin = require('copy-webpack-plugin');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');

var entry= {
    // index: './app/main.js'
};

var loaders= {
    loaders: [
        {
            test: /\.json$/,
            loader: 'json-loader'
        }
    ]
};

var resolve = {};

var plugins = [
    new CopyWebPackPlugin([
        // {'from':'./app/index.html', 'to':'./index.html'},
        // {'from':'./app/package.json', 'to':'./package.json'}
        {'from': './app'}
    ])
];

var externals= {};

module.exports = {
    devtool: "source-map",
    entry: entry,
    output: {
        path: path.join(__dirname, './dist/app'),
        filename: "main.js",
        sourceMapFilename: '[file].map'
    },
    module: loaders,
    externals: externals,
    plugins: plugins,
    resolve: resolve,
    target: 'electron-main'
};
