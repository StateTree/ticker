const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require("path");
const env  = require("yargs").argv.env; // use --env with webpack 2

var libraryName = "ticker";

const paths = {
    context: path.join(__dirname, "./src/"),
    output: path.join(__dirname, "./lib/"),
    entry: {}
};

paths.entry[libraryName] = "./index.js";

var plugins = [];

if (env === "build") {
	plugins.push(new UglifyJsPlugin({
		minimize: true
	}));
}

const config = {
	context: paths.context,
	entry: paths.entry,
	devtool: "source-map",
	output: {
		path: paths.output,
		filename: "[name].js",
		library: libraryName,
		libraryTarget: "umd",
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				enforce: "pre",
				loader: "eslint-loader",
				exclude: /node_modules/
			},
			{
				test: /(\.jsx|\.js)$/,
				loader: "babel-loader",
				exclude: /(node_modules|bower_components)/
			}
		]
	},
	resolve: { // In resolve we tell Webpack where to look for modules. as of Webpack ^2.0 important to give node modules folder too
		extensions: [".json", ".js", ".jsx"],
		modules: [paths.context,"node_modules"],
	},
	plugins: plugins
};

module.exports = config;
