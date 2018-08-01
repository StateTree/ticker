const path = require("path");

var libraryName = "ticker";

const paths = {
    context: path.join(__dirname, "./src/"),
    output: path.join(__dirname, "./"),
    lib: path.join(__dirname, "./lib"),
    entry: {
        'build/demo/index': "./demo/index.js"
    }
};

const libPath = "lib/" + libraryName;
paths.entry[libPath] = "./lib/index.js";

const config = {
    context: paths.context,
    entry: paths.entry,
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
                test: /\.(js)$/,
                loader: "babel-loader",
                exclude: /node_modules/
            }
        ]

    }
};


module.exports = config;


