/* eslint no-var: 0 */
var command = require("./command");
var cmdLine = "./node_modules/.bin/webpack --progress --config webpack.config.js";
command.execute(cmdLine,true);

var cmdLine = "./node_modules/.bin/babel src --out-dir lib";
command.execute(cmdLine,true);


