var path = require('path');
var webpack = require('webpack');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');

var entry= {
    index: './src/index.js',
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
        'bootstrap',
        'd3-array',
        'd3-format',
        'd3-time',
        'd3-time-format',
        'moment'
    ]
};

var loaders= {
    loaders: [
        {
            test: /\.js$/,
            loaders: [ 'babel' ],
            exclude: /node_modules/,
            include: __dirname
        },
        {
            test: /\.less$/,
            loader: "style!css!less"
        },
        {
            test: /\.scss/,
            loader: "style!css!sass"
        },
        {
            test: /\.css/,
            loader: "style!css"
        },
        {
            test: path.join(nodeModulesPath, '/jquery/dist/jquery.min.js'),
            loader: 'expose?jQuery'
        },
        {
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'
        },
    ]
};

var resolve = {
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

var plugins = [
    new  webpack.optimize.CommonsChunkPlugin({
        name:"common",
        filename: "common.dist.js"
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
];

var externals= {
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
        sourceMapFilename: '[file].map'
    },
    module: loaders,
    externals: externals,
    plugins: plugins,
    resolve: resolve,
    target: 'electron-renderer'
};
