/* eslint no-var: 0 */
// webpack defined build, it can be umd or 
var command = require('./command');
var cmdLine = './node_modules/.bin/webpack --progress --config webpack.config.js';
command.execute(cmdLine,true);

// Module Build to use in import
var cmdLine = './node_modules/.bin/babel src --out-dir lib';
command.execute(cmdLine,true);



