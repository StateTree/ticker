const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

var libraryName = 'ticker';
var libFile;

var plugins = [];

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({
        minimize: true
    }));
    libFile = libraryName + '.min.js';
} else {
    libFile = libraryName + '.js';
}

const config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: libFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    resolve: {
        modules: [path.resolve('./src')],
        extensions: ['.json', '.js']
    },
    plugins: plugins
};

module.exports = config;
